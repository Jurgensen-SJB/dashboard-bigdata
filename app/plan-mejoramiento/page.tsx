import type { Metadata } from "next";
import AvisoAcademico from "@/components/AvisoAcademico";
import PlanMejoramiento from "@/components/plan/PlanMejoramiento";

export const metadata: Metadata = {
  title: "Plan de Mejoramiento · DataCommerce Analytics",
  description:
    "Estrategias basadas en datos, objetivos estratégicos, plan de acción, cronograma anual y cuadro de mando a 12 meses.",
};

export default function PaginaPlanMejoramiento() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-usb-verde">Plan de mejoramiento comercial</h2>
          <p className="text-sm text-gray-600">
            Propuesta estratégica del equipo de Business Intelligence para aumentar ingresos en un 20 % y elevar el margen
            global al 28 %.
          </p>
        </div>
      </div>

      <AvisoAcademico />

      <PlanMejoramiento />
    </div>
  );
}
