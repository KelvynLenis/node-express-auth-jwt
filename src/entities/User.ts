import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'text', unique: true})
  email: string

  @Column({ type: 'text' })
  password: string

  constructor(name: string, email: string, password: string, id: number) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
  }
}