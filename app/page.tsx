"use client";

import { useState } from "react";
import Header from "./_components/header";
import UserForm from "./_components/user-form";
import TableToPDF from "./_components/table-to-pdf";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <div className="p-4">
      {" "}
      <Header />
      <h2 className="font-semibold px-4 ">
        Bem vindo ao nosso site planejador de treino Fitness!
      </h2>
      <div className="px-4 pt-2 text-sm">
        Obtenha planos de exercícios personalizados e adaptados às suas
        necessidades. Seja iniciante ou experiente, nós o guiamos em direção a
        uma versão mais saudável e em forma de você.{" "}
        <div className="font font-semibold">
          Comece sua jornada fitness hoje!
        </div>
      </div>
      <div className="px-4 pt-8">
        <UserForm setData={setData} setLoading={setLoading} loading={loading} />
      </div>
      <div className="p-4">
        {loading ? (
          <div
            className={
              "w-full text-center text-secondary-light p-2 text-xl font-normal"
            }
          >
            Working on it...
          </div>
        ) : data.length > 0 ? (
          <TableToPDF data={data} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
