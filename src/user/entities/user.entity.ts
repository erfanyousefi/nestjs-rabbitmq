import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @CreateDateColumn()
  created_at: Date;
}
