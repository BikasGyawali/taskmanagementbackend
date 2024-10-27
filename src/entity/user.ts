import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Task } from './task';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  userName: string;

  @Column({unique: true, nullable: false})
  @IsEmail()
  email: string;

  @Column({nullable: false})
  password: string;

  @Column({ default: "user" })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

   //One-to-Many relationship with Task
   @OneToMany(() => Task, (task) => task.user)
   tasks: Task[];

}
