const { Connection } = require('typeorm');
const { Users } = require('src/users/entities/users.entity');
const { hashPassword } = require('@app/jwt-libs');
const { Gender } = require('src/students/entities/gender.entity');
const { Religion } = require('src/students/entities/religion.entity');
const { Degree } = require('src/teachers/entities/degree.entity');
const { Roles } = require('src/users/entities/roles.entity');
const { Parents } = require('src/students/entities/parents.entity');

const seed = async (connection) => {
    const password = await hashPassword("@Secret123!");

    const users = [
        { role_id: 1, username: 'agung', email: 'agung@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 2, username: 'pangestu', email: 'pangestu@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 3, username: 'branz', email: 'branz@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 4, username: 'meggy', email: 'meggy@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 5, username: 'budi', email: 'budi@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 1, username: 'yulian', email: 'yulian@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 2, username: 'sisri', email: 'sisri@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 3, username: 'supri', email: 'supri@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 4, username: 'kuproi', email: 'kuproi@gmail.com', password: password, img: 'image.jpg' },
        { role_id: 5, username: 'jamet', email: 'jamet@gmail.com', password: password, img: 'image.jpg' },
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
    });

    const religions = [
        { religion: 'Budha' },
        { religion: 'Hindu' },
        { religion: 'Islam' },
        { religion: 'Konghucu' },
        { religion: 'Kristen Katolik' },
        { religion: 'Kristen Protestan' },
    ];

    await connection.transaction(async (manager) => {
        for (const data of religions) {
            const religion = new Religion();
            religion.religion = data.religion;
            await manager.save(religion);
        }
    });

    const degrees = [
        { degree: 'Doktor' },
        { degree: 'Magister' },
        { degree: 'Sarjana' },
        { degree: 'Sarjana Terapan' },
        { degree: 'Ahli Madya' },
        { degree: 'Ahli Pratama' },
        { degree: 'Ahli Muda' },
    ];

    await connection.transaction(async (manager) => {
        for (const data of degrees) {
            const degree = new Degree();
            degree.degree = data.degree;
            await manager.save(degree);
        }
    });

    const roles = [
        { role: 'Siswa' },
        { role: 'Guru' },
        { role: 'Staff' },
        { role: 'Orang Tua' },
        { role: 'Kepala Sekolah' },
    ];

    await connection.transaction(async (manager) => {
        for (const data of roles) {
            const role = new Roles();
            role.role = data.role;
            await manager.save(role);
        }
    });

    const parents = [
        { user_id: 4, father: 'Mukhlas', mother: 'Sri', phone_father: '082234252222', phone_mother: '082234253333', img_mother: 'img-female.jpg', img_father: 'img-male.jpg', religion_father: 1, religion_mother: 1, address: 'Jl Pegangsaan Timur No 17' },
        { user_id: 9, father: 'Mukhlis', mother: 'Sri', phone_father: '082234252222', phone_mother: '082234253333', img_mother: 'img-female.jpg', img_father: 'img-male.jpg', religion_father: 1, religion_mother: 1, address: 'Jl Pegangsaan Timur No 18' },
    ];

    await connection.transaction(async (manager) => {
        for (const data of parents) {
            const parent = new Parents();
            parent.user_id = data.user_id;
            parent.father = data.father;
            parent.mother = data.mother;
            parent.phone_father = data.phone_father;
            parent.phone_mother = data.phone_mother;
            parent.img_father = data.img_father;
            parent.img_mother = data.img_mother;
            parent.religion_father = data.religion_father;
            parent.religion_mother = data.religion_mother;
            parent.address = data.address;
            await manager.save(parent);
        }
    });
};

module.exports = seed;
