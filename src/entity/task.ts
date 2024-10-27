import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { User } from "./user";
  
  @Entity("task")
  export class Task {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: false })
    title: string;
  
    @Column({ type: "text", nullable: false })
    description: string;
  
    @Column({ type: "date", nullable: false })
    dueDate: Date;
  
    @Column({ type: "varchar", length: 255, nullable: true })
    attachment?: string;
  
    @Column({ default: false })
    completed: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    //relationship with User
    @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
    user: User;
  }
  