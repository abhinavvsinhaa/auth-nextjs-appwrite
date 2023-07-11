import { connect } from '@/dbconfig/dbconfig';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // check if user already exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User do not exists' },
        { status: 400 }
      );
    }

    const validPassword = await bcryptjs.compare(user.password, password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    // create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // create token
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: '1h',
    });

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    });
    response.cookies.set('token', token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
