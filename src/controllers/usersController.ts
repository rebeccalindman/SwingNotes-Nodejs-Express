import { addNewUser } from "../services/userService";
import { NewUser, PublicUser } from "../types/user";
import bcrypt from 'bcrypt';



export async function register(req, res) {
    try {
        const userInput : NewUser = req.body;
        userInput.hashedPassword = await bcrypt.hash(userInput.hashedPassword, 10);
        const user = userInput;
        const result = await addNewUser(user);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err);
    }
}


//Helper Functions

// todo Check if user already exists
// PublicUser type
