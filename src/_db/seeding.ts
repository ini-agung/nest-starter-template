import { getConnection } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Roles } from 'src/users/entities/roles.entity';
import { RoleList } from 'src/users/entities/roles.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';
import { Religion } from 'src/students/entities/religion.entity';
import { Degree } from 'src/teachers/entities/degree.entity';
import { validate } from 'class-validator';
import * as faker from 'faker';

export async function seedDatabase(): Promise<void> {
    const connection = getConnection();
    const userRepository = connection.getRepository(Users);
    const roleRepository = connection.getRepository(Roles);
    const teacherRepository = connection.getRepository(Teachers);
    const religionRepository = connection.getRepository(Religion);
    const degreeRepository = connection.getRepository(Degree);

    // Create roles
    const rolesList = [
        'Students',
        'Teachers',
        'Staff',
        'Parents',
    ];
    const rolesData = rolesList.map((role) => ({ role }));
    await roleRepository.save(roleRepository.create(rolesData));

    // Generate fake user data
    const userData = [];
    for (let i = 0; i < 10; i++) {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const img = faker.image.avatar();

        const user = new Users();
        user.role_id = faker.random.number({ min: 1, max: 4 });
        user.username = username;
        user.email = email;
        user.password = password;
        user.img = img;

        const errors = await validate(user);

        if (errors.length === 0) {
            userData.push(user);
        }
    }

    await userRepository.save(userData);

    // Generate fake religion data
    const religionNames = [
        'Budha',
        'Hindu',
        'Islam',
        'Konghucu',
        'Kristen Katolik',
        'Kristen Protestan'
    ];
    const religions = religionNames.map((religion) => ({ religion }));
    await religionRepository.save(religionRepository.create(religions));

    // Generate fake degree data
    const degreeNames = ['Ahli Pratama',
        'Ahli Muda',
        'Ahli Madya',
        'Sarjana Terapan',
        'Sarjana',
        'Magister',
        'Doctor'];
    const degrees = degreeNames.map((degree) => ({ degree }));
    await degreeRepository.save(degreeRepository.create(degrees));

    // Generate fake teachers data
    const teacherData = [];
    for (let i = 0; i < 10; i++) {
        const degree = faker.random.arrayElement(degrees);
        const religion = faker.random.arrayElement(religions);

        teacherData.push({
            nik: faker.random.number(),
            degree_id: degree.id,
            full_name: faker.name.findName(),
            nick_name: faker.internet.userName(),
            date_birth: faker.date.past(),
            place_birth: faker.address.city(),
            gender_id: faker.random.number({ min: 1, max: 2 }), // Assuming 1 for male and 2 for female
            religion_id: religion.id,
            phone: faker.phone.phoneNumber(),
            entry_year: faker.date.past(),
            address: faker.address.streetAddress(),
        });
    }

    await teacherRepository.save(teacherRepository.create(teacherData));
}