import { Body, Controller, Get, Post, HttpException, HttpStatus, Res, ValidationPipe, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { responseJson } from '@app/response';
import { UsersService } from 'src/users/users.service';
import { JwtLibsService, comparePasswords } from '@app/jwt-libs';
import { JwtLibsGuard } from '@app/jwt-libs/jwt-libs.guard';
import { Public } from '@app/jwt-libs/public.decorator';
import { type } from 'os';
import { setCurrentUser } from '@app/helper';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly jwtLibService: JwtLibsService) { }
    /**
     * Handles user sign-in.
     * @param signinDto - The DTO containing user's identity and password.
     * @param response - The HTTP response object.
     */
    @Public()
    @Post('signin')
    async signin(@Body(new ValidationPipe()) signinDto: SigninDto, @Res() response) {
        const user = await this.userService.findOne(signinDto.identity);
        if (user) {
            const compare = await comparePasswords(signinDto.password, user.password);
            if (compare) {
                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    role: user.role,
                    current_datetime: user.current_datetime,
                    detail: user.metadata,
                    permission: user.flattenedPermissions,
                };
                setCurrentUser(payload);
                const access_token = await this.jwtLibService.generateToken(payload);
                const refresh_token = await this.jwtLibService.generateRefresh({ user, refreshToken: true });
                const decode = await this.jwtLibService.decodeJwt(access_token.access_token);
                const data = {
                    status: true,
                    statusCode: HttpStatus.OK,
                    message: 'Success Login',
                    data: {}
                };
                delete user.password;
                data.data = Object.assign(data.data,
                    { access_token: access_token.access_token, refresh_token: refresh_token, expIn: decode.exp });
                responseJson(data, data.statusCode, response);
            } else {
                const data = {
                    status: true,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Wrong Password',
                    data: {}
                };
                responseJson(data, data.statusCode, response);
            }
        }
    }

    /**
    * Handles user sign-up.
    * @param signUpDto - The DTO containing user's registration information.
    * @param response - The HTTP response object.
    */
    @Public()
    @Post('signup')
    async signup(@Body(new ValidationPipe) signUpDto: SignupDto, @Res() response) {
        const user = await this.userService.create(signUpDto);
        const data = {
            status: true,
            statusCode: HttpStatus.ACCEPTED,
            message: 'Success Create New User',
            data: {}
        };
        data.data = user;
        responseJson(data, data.statusCode, response);
    }
}
