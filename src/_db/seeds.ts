import { Connection } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { hashPassword } from '@app/jwt-libs';
import { Gender } from 'src/students/entities/gender.entity';
import { Religion } from 'src/students/entities/religion.entity';
import { Degree } from 'src/teachers/entities/degree.entity';

export const seed = async (connection: Connection) => {
    const password = await hashPassword("@Secret123!")

    const users = [
        { role_id: 1, username: 'agung', email: 'agung@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 2, username: 'pangestu', email: 'pangestu@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 3, username: 'branz', email: 'branz@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 4, username: 'meggy', email: 'meggy@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 1, username: 'yulian', email: 'yulian@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 2, username: 'sisri', email: 'sisri@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 3, username: 'supri', email: 'supri@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 4, username: 'kuproi', email: 'kuproi@gmail.com', password: password, img: 'image.jpg' },
    ];

    await connection.transaction(async (manager) => {
        for (const data of users) {
            const user = new Users();
            user.role_id = data.role_id;
            user.username = data.username;
            user.email = data.email;
            user.password = data.password;
            user.img = data.img;
            await manager.save(user);
        }
    });


    const genders = [
        { gender: 'Laki-laki' },
        { gender: 'Perempuan' }
    ];

    await connection.transaction(async (manager) => {
        for (const data of genders) {
            const gender = new Gender();
            gender.gender = data.gender;
            await manager.save(gender);
        }
    })


    const religions = [
        { religion: 'Budha' },
        { religion: 'Hindu' },
        { religion: 'Islam' },
        { religion: 'Konghucu' },
        { religion: 'Kristen Katolik' },
        { religion: 'Kristen Protestan' },
    ]

    await connection.transaction(async (manager) => {
        for (const data of religions) {
            const religion = new Religion();
            religion.religion = data.religion;
            await manager.save(religion);
        }
    })

    const degrees = [
        { degree: 'Doktor' },
        { degree: 'Magister' },
        { degree: 'Sarjana' },
        { degree: 'Sarjana Terapan' },
        { degree: 'Ahli Madya' },
        { degree: 'Ahli Pratama' },
        { degree: 'Ahli Muda' },
    ]

    await connection.transaction(async (manager) => {
        for (const data of degrees) {
            const degree = new Degree();
            degree.degree = data.degree;
            await manager.save(degree);
        }
    })


};

