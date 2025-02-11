import { Request, Response } from 'express';
import userService from './user.service';

async function register(req: Request, res: Response) {
  try {
    const { userData, token } = await userService.registerUser(req.body);
    res.status(201).json({ userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req: Request, res: Response) {
  try {
    const result = await userService.loginUser(req.body);
    if (result) {
      res.json(result);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
}

async function getUser(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const user = await userService.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user' });
  }
}

async function uploadImage(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const fileName = req.query.fileName as string;
    if (!fileName) {
      return res.status(400).json({ error: 'Filename is required as a query parameter' });
    }

    const { signedUrl, path } = await userService.getUploadUrl(userId, fileName);
    res.json({ signedUrl, path });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export default { register, login, getUser,uploadImage };