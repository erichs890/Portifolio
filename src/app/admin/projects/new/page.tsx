import { ProjectForm } from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Novo Projeto
      </h1>
      <ProjectForm />
    </div>
  );
}
