import { CreateProjectDto } from '../dto/create-project.dto';

export function duplicateName(
  projects: Array<CreateProjectDto>,
  title: string,
) {
  let count: CreateProjectDto[] = [];
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].title.toLowerCase() === title.toLowerCase()) {
      count.push(projects[i]);
    }
  }
  return count;
}
