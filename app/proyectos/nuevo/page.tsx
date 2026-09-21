import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { ProjectForm } from "@/components/projects/ProjectForm";

export default function NuevoProyectoPage() {
  return (
    <div className="max-w-lg">
      <PageHeader title="Nuevo proyecto" description="Un cliente de agencia o un proyecto propio." />
      <Card>
        <CardBody>
          <ProjectForm />
        </CardBody>
      </Card>
    </div>
  );
}
