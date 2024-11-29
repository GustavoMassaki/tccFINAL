"use client";

import {
  useForm,
  SubmitHandler,
  FormProvider,
  Controller,
} from "react-hook-form";
import { SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import { FormControl, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { GENDERS, FITNESS_LEVELS, GOALS } from "@/_constants";
import { Button } from "./ui/button";

interface FormData {
  height: string;
  weight: string;
  age: string;
  gender: string;
  fitnessLevel: string;
  goal: string;
}

const GENERATE_URL = "/api/generate";

export default function UserForm({
  setData,
  setLoading,
  loading,
}: {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}) {
  const methods = useForm<FormData>({
    defaultValues: {
      height: "",
      weight: "",
      age: "",
      gender: "",
      fitnessLevel: "",
      goal: "",
    },
  });
  const { handleSubmit, control } = methods;

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);

    try {
      const response = await fetch(GENERATE_URL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData); // Pass data to parent
        toast.success("Workout generated!");
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit the form!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-full p-4 border bg-white border-gray-100 rounded-xl shadow-xl"
        autoComplete="off"
      >
        <div className="flex flex-wrap -mx-3 mb-3">
          {["height", "weight", "age"].map((fieldName) => (
            <div key={fieldName} className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Controller
                name={fieldName as "height" | "weight" | "age"}
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      {fieldName === "height"
                        ? "Altura (cm)"
                        : fieldName === "weight"
                        ? "Peso (kg)"
                        : "Idade "}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="border-blue-400" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          {[
            { name: "gender", options: GENDERS },
            { name: "fitnessLevel", options: FITNESS_LEVELS },
            { name: "goal", options: GOALS },
          ].map(({ name, options }) => (
            <div key={name} className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Controller
                name={name as "gender" | "fitnessLevel" | "goal"}
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      {name === "gender"
                        ? "Gênero"
                        : name === "fitnessLevel"
                        ? "Level Fitness"
                        : "Objetivo"}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="flex justify-between border-blue-400">
                          {" "}
                          <span className="text-gray-500">
                            {options.find((opt) => opt.value === field.value)
                              ?.title || "Selecione uma opção"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-700 px-3 py-2 "
          >
            {loading ? (
              "Please wait..."
            ) : (
              <div className="flex justify-center items-center gap-2">
                Enviar <SendHorizontal />
              </div>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
