import { NextResponse } from "next/server";
import { CohereClientV2 } from "cohere-ai";
import dotenv from "dotenv";
import { db } from "@/app/_lib/prisma";

dotenv.config();

const apiKey = process.env.COHERE_API_KEY;

const cohere = new CohereClientV2({
  token: apiKey,
});

interface userDataProps {
  height: string;
  weight: string;
  age: string;
  gender: string;
  fitnessLevel: string;
  goal: string;
}

const generatePrompt = (userData: userDataProps) => {
  return `You are a fitness expert. Based on the following user data, generate a weekly exercise plan for Monday through Friday in **valid JSON format only** (without any extra characters, markdown, or explanations). Only return the JSON response, no additional text, metadata, or formatting.

User Data:
${JSON.stringify(userData)}

**The exercise plan must meet these criteria**:
1. Provide **exactly three distinct exercises per day** for Monday through Friday.
2. Each exercise should have:
   - **"exercise"**: Name of the exercise (e.g., "Squats").
   - **"sets"**: Number of sets (e.g., 3).
   - **"reps"**: Reps per set (e.g., "12 reps").
   - **"weight"**: Weight used (e.g., "bodyweight" or a specific weight like "50 kg").
   - **"rest"**: Rest time between sets (e.g., "60 seconds").
3. Ensure no exercises are repeated within a single day or across different days.
4. Include **rest days for Saturday and Sunday** (no exercises for these days).
5. **Return only valid JSON** in the exact structure shown below. Do not add extra text or comments.
6. Do not include any extra fields, such as "Multiplier", "comments", or any other metadata.

Important: the content of the fields must be in portuguese!
### Example response format (strict JSON structure):

[
  {
    "day": "Segunda-feira",
    "exercises": [
      {
        "exercise": "Agachamentos",
        "sets": 3,
        "reps": "12 repetições",
        "weight": "peso corporal",
        "rest": "60 segundos"
      },
      {
        "exercise": "Flexões",
        "sets": 3,
        "reps": "15 repetições",
        "weight": "peso corporal",
        "rest": "60 segundos"
      },
      {
        "exercise": "Barra fixa",
        "sets": 3,
        "reps": "8 repetições",
        "weight": "peso corporal",
        "rest": "90 segundos"
      }
    ]
  },
  {
    "day": "Terça-feira",
    "exercises": [
      {
        "exercise": "Levantamento Terra",
        "sets": 4,
        "reps": "8 repetições",
        "weight": "80 kg",
        "rest": "90 segundos"
      },
      {
        "exercise": "Supino",
        "sets": 4,
        "reps": "10 repetições",
        "weight": "50 kg",
        "rest": "90 segundos"
      },
      {
        "exercise": "Afundos",
        "sets": 3,
        "reps": "12 repetições cada perna",
        "weight": "peso corporal",
        "rest": "60 segundos"
      }
    ]
  },
  {
    "day": "Quarta-feira",
    "exercises": [
      {
        "exercise": "Leg Press",
        "sets": 3,
        "reps": "10 repetições",
        "weight": "100 kg",
        "rest": "60 segundos"
      },
      {
        "exercise": "Supino Inclinado",
        "sets": 3,
        "reps": "8 repetições",
        "weight": "60 kg",
        "rest": "90 segundos"
      },
      {
        "exercise": "Remada Curvada",
        "sets": 4,
        "reps": "8 repetições",
        "weight": "40 kg",
        "rest": "90 segundos"
      }
    ]
  },
  {
    "day": "Quinta-feira",
    "exercises": [
      {
        "exercise": "Desenvolvimento de Ombros",
        "sets": 3,
        "reps": "10 repetições",
        "weight": "30 kg",
        "rest": "60 segundos"
      },
      {
        "exercise": "Mergulho em Paralelas",
        "sets": 3,
        "reps": "12 repetições",
        "weight": "peso corporal",
        "rest": "60 segundos"
      },
      {
        "exercise": "Agachamento com Barra",
        "sets": 3,
        "reps": "8 repetições",
        "weight": "70 kg",
        "rest": "90 segundos"
      }
    ]
  },
  {
    "day": "Sexta-feira",
    "exercises": [
      {
        "exercise": "Levantamento Terra Romeno",
        "sets": 3,
        "reps": "10 repetições",
        "weight": "90 kg",
        "rest": "90 segundos"
      },
      {
        "exercise": "Crucifixo",
        "sets": 3,
        "reps": "12 repetições",
        "weight": "12 kg",
        "rest": "60 segundos"
      },
      {
        "exercise": "Puxada na Barra",
        "sets": 4,
        "reps": "8 repetições",
        "weight": "50 kg",
        "rest": "60 segundos"
      }
    ]
  }
]`;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { height, weight, age, gender, fitnessLevel, goal } = body;
    const userInfo = body;

    console.log("Received user data:", body);

    const prompt = generatePrompt({
      height,
      weight,
      age,
      gender,
      fitnessLevel,
      goal,
    });

    console.log("Sending request to Cohere...");
    const response = await cohere.chat({
      model: "command-r-plus",
      messages: [{ role: "user", content: prompt }],
    });

    if (!response.message || !response.message.content) {
      return NextResponse.json(
        {
          error:
            "Invalid response from Cohere API. 'message' or 'content' is missing.",
        },
        { status: 500 }
      );
    }

    const rawResponse = response.message.content[0]?.text;

    let parsedResponse;
    try {
      console.log("Parsing the raw response as JSON...");
      parsedResponse = JSON.parse(rawResponse);
      console.log("Parsed response:", parsedResponse);
    } catch (error: any) {
      console.error("Error parsing JSON:", error);
    }
    try {
      await db.user.create({
        data: {
          userInfo: userInfo,
          apiResponse: parsedResponse,
        },
      });
      console.log("User added successfully to the database.");
    } catch (dbError: any) {
      console.error("Error adding user to the database:", dbError);
    }
    return NextResponse.json(parsedResponse);
  } catch (error: any) {
    console.error("Cohere API Error:", error.message);
    return NextResponse.json(
      {
        error: "Error communicating with Cohere API",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
