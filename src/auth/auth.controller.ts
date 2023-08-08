import { Body, Controller, Get, Post, HttpException, HttpStatus, Res, ValidationPipe, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { responseJson } from '@app/response';
import { UsersService } from 'src/users/users.service';
import { JwtLibsService, comparePasswords } from '@app/jwt-libs';
import { JwtLibsGuard } from '@app/jwt-libs/jwt-libs.guard';
import { Public } from '@app/jwt-libs/public.decorator';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly jwtLibService: JwtLibsService) { }
    @Public()
    @Post('signin')
    async signin(@Body(new ValidationPipe()) signinDto: SigninDto, @Res() response) {
        const user = await this.userService.findOne(signinDto.identity);
        if (user.length > 0) {
            const compare = await comparePasswords(signinDto.password, user[0].password)
            if (compare) {
                const payload = { id: user[0].id, username: user[0].username, fullname: user[0].fullname, email: user[0].email };
                const token = await this.jwtLibService.generateToken(payload);
                const decode = await this.jwtLibService.decodeJwt(token.access_token);
                const data = {
                    status: true,
                    statusCode: HttpStatus.OK,
                    message: 'Success Login',
                    data: {}
                };
                delete user[0].password;
                data.data = Object.assign(data.data,
                    { access_token: token.access_token, refresh_token: token.refresh_token, expIn: decode.exp });
                responseJson(data, data.statusCode, response);
            } else {
                const data = {
                    status: true,
                    statusCode: 200,
                    message: 'Wrong Password',
                    data: {}
                };
                responseJson(data, data.statusCode, response);
            }
        } else {
            const data = {
                status: false,
                statusCode: 200,
                message: 'users not found',
                data: {}
            };
            responseJson(data, data.statusCode, response);
        }
    }

    @Public()
    @Post('signup')
    async signup(@Body(new ValidationPipe) signUpDto: SignupDto, @Res() response) {
        const signUpNewUser = await this.userService.create(signUpDto);
        if (signUpNewUser.affectedRows > 0) {
            const data = {
                status: true,
                statusCode: HttpStatus.ACCEPTED,
                message: 'Success create new user',
                data: {}
            };
            responseJson(data, data.statusCode, response);
        } else {
            const data = {
                status: true,
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Failed to created user',
                data: {}
            };
            responseJson(data, data.statusCode, response);
        }
    }

}
