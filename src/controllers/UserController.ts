import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError } from "../helpers/api-errors";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body
    
    const userExists = await userRepository.findOneBy({ email })
  
    if (userExists) {
      throw new BadRequestError('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await userRepository.create({ name, email, password: hashedPassword })

    await userRepository.save(newUser)

    const { password: _, ...user } = newUser

    return res.status(201).json(user)
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    const user = await userRepository.findOneBy({ email })

    if (!user) {
      throw new BadRequestError('email or password is incorrect')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new BadRequestError('email or password is incorrect')
    }

    const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET ?? '', { expiresIn: 60 * 60 * 24 * 3 }) // 3 days

    const { password: _, ...userLogin } = user

    return res.json({ user: userLogin, token: token })
  }

  async getProfile(req: Request, res: Response) {
    return res.json(req.user)
  }
}