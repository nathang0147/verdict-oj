import {Problem} from "@modules/problem/entities/problem.entity";

export class GetProblemWithStatusDto  {
    id: string;
    title: string;
    accepted: any;
    total: any;
    difficulty: number;
    status: string;
}