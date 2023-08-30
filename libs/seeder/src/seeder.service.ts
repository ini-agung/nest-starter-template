import { Injectable } from '@nestjs/common';
import { hashPassword } from '@app/jwt-libs';
import { User } from 'src/users/entities/user.entity';
import { Gender } from 'src/users/entities/gender.entity';
import { Religion } from 'src/users/entities/religion.entity';
import { Degree } from 'src/teachers/entities/degree.entity';
import { Role } from 'src/users/entities/role.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Connection } from 'typeorm';
import { Class, Classroom, } from 'src/classrooms/entities/classroom.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Student } from 'src/students/entities/student.entity';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Permission, RolePermission } from 'src/permissions/entities/permission.entity';
import * as faker from 'faker';
@Injectable()
export class SeederService {
    constructor(private readonly connection: Connection) { }

    async seed() {
        console.log("=== START ===");
        console.log("=== GENDER ===");
        const genders = ['Laki-laki', 'Perempuan', 'Lainnya'];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Gender table
            for (const data of genders) {
                const existingGender = await manager.findOne(Gender, { where: { gender: data } });
                if (!existingGender) {
                    const gender = new Gender();
                    gender.gender = data;
                    await manager.save(gender);
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== CLASSROOM ===");
        const classrooms = [
            'Ruang 101 A', 'Ruang 102 A', 'Ruang 103 A', 'Ruang 104 A',
            'Ruang 105 A', 'Ruang 201 A', 'Ruang 202 A', 'Ruang 203 A',
            'Ruang 204 A', 'Ruang 205 A', 'Ruang 101 B', 'Ruang 102 B',
            'Ruang 103 B', 'Ruang 104 B', 'Ruang 105 B', 'Ruang 201 B',
            'Ruang 202 B', 'Ruang 203 B', 'Ruang 204 B', 'Ruang 205 B',];
        await this.connection.transaction(async (manager) => {
            //Check duplicates for Classroom table
            for (const data of classrooms) {
                const existingClassrom = await manager.findOne(Classroom, { where: { classroom: data } });
                if (!existingClassrom) {
                    const classroom = new Classroom();
                    classroom.classroom = data;
                    await manager.save(classroom)
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== SUBJECTS ===");
        const subjects = [
            { subject: "Matematika", description: "Pelajaran tentang angka, hitungan, dan perhitungan dalam berbagai bentuk." },
            { subject: "Bahasa Indonesia", description: "Pelajaran tentang bahasa Indonesia, tata bahasa, dan sastra Indonesia." },
            { subject: "Bahasa Inggris", description: "Pelajaran tentang bahasa Inggris, komunikasi, dan sastra Inggris." },
            { subject: "Ilmu Pengetahuan Alam", description: "Pelajaran tentang konsep dasar ilmu pengetahuan alam seperti fisika, kimia, dan biologi." },
            { subject: "Sejarah", description: "Pelajaran tentang peristiwa dan perkembangan sejarah suatu negara atau bangsa." },
            { subject: "Seni Rupa", description: "Pelajaran tentang seni visual, termasuk gambar, lukisan, dan seni kriya." },
            { subject: "Pendidikan Kewarganegaraan", description: "Pelajaran tentang warga negara, kehidupan bermasyarakat, dan kepemimpinan." },
            { subject: "Agama", description: "Pelajaran tentang agama dan nilai-nilai spiritual dalam kehidupan." },
            { subject: "Pendidikan Jasmani dan Kesehatan", description: "Pelajaran tentang olahraga, kebugaran fisik, dan kesehatan." },
            { subject: "Bahasa Jawa", description: "Pelajaran tentang bahasa Jawa dan budaya Jawa." },
            { subject: "Bahasa Sunda", description: "Pelajaran tentang bahasa Sunda dan budaya Sunda." },
            { subject: "Biologi", description: "Pelajaran tentang makhluk hidup, organisme, dan lingkungan hidup." },
            { subject: "Fisika", description: "Pelajaran tentang sifat, gerak, dan energi benda serta fenomena alam." },
            { subject: "Kimia", description: "Pelajaran tentang sifat, struktur, dan reaksi zat serta materi dalam kehidupan." },
            { subject: "Geografi", description: "Pelajaran tentang bumi, peta, dan fenomena geosfer, hidrosfer, dan atmosfer." },
            { subject: "Ekonomi", description: "Pelajaran tentang produksi, distribusi, dan konsumsi barang dan jasa dalam masyarakat." },
            { subject: "Akuntansi", description: "Pelajaran tentang pencatatan keuangan dan laporan keuangan suatu entitas." },
            { subject: "Sosiologi", description: "Pelajaran tentang masyarakat, interaksi sosial, dan struktur sosial." },
            { subject: "Antropologi", description: "Pelajaran tentang manusia, budaya, dan kehidupan sosial." },
            { subject: "Arkeologi", description: "Pelajaran tentang peninggalan budaya dan artefak dari masa lalu." }
        ];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Religion table
            for (const data of subjects) {
                const existingReligion = await manager.findOne(Subject, { where: { subject: data.subject } });
                if (!existingReligion) {
                    const subject = new Subject();
                    subject.subject = data.subject;
                    subject.description = data.description;
                    await manager.save(subject);
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== RELIGIONS ===");
        const religions = [
            'Budha', 'Hindu', 'Islam',
            'Konghucu', 'Kristen Katolik',
            'Kristen Protestan',
        ];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Religion table
            for (const data of religions) {
                const existingReligion = await manager.findOne(Religion, { where: { religion: data } });
                if (!existingReligion) {
                    const religion = new Religion();
                    religion.religion = data;
                    await manager.save(religion);
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== DEGREES ===");
        const degrees = [
            'Doktor', 'Magister', 'Profesi/Spesialis',
            'Sarjana', 'Sarjana Terapan',
            'Ahli Madya', 'Ahli Pratama',
            'Ahli Muda',
        ];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Degree table
            for (const data of degrees) {
                const existingDegree = await manager.findOne(Degree, { where: { degree: data } });
                if (!existingDegree) {
                    const degree = new Degree();
                    degree.degree = data;
                    await manager.save(degree);
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== ROLES ===");
        const roles = [
            'Siswa',
            'Guru',
            'Staff',
            'Orang Tua',
            'Kepala Sekolah',
        ];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Roles table
            for (const data of roles) {
                const existingRole = await manager.findOne(Role, { where: { role: data } });
                if (!existingRole) {
                    const role = new Role();
                    role.role = data;
                    await manager.save(role);
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== USERS ===");
        const users = [
            { role_id: 1, username: 'agung', email: 'agung@gmail.com' },
            { role_id: 2, username: 'pangestu', email: 'pangestu@gmail.com' },
            { role_id: 3, username: 'branz', email: 'branz@gmail.com' },
            { role_id: 4, username: 'meggy', email: 'meggy@gmail.com' },
            { role_id: 5, username: 'budi', email: 'budi@gmail.com' },
            { role_id: 1, username: 'yulian', email: 'yulian@gmail.com' },
            { role_id: 2, username: 'sisri', email: 'sisri@gmail.com' },
            { role_id: 3, username: 'supri', email: 'supri@gmail.com' },
            { role_id: 4, username: 'kuproi', email: 'kuproi@gmail.com' },
            { role_id: 5, username: 'jamet', email: 'jamet@gmail.com' },
            { role_id: 1, username: 'siska', email: 'siska@gmail.com' },
            { role_id: 2, username: 'eva', email: 'eva@gmail.com' },
            { role_id: 3, username: 'evi', email: 'evi@gmail.com' },
            { role_id: 4, username: 'salsa', email: 'salsa@gmail.com' },
            { role_id: 5, username: 'dela', email: 'dela@gmail.com' },
            { role_id: 1, username: 'bella', email: 'bella@gmail.com' },
            { role_id: 2, username: 'intan', email: 'intan@gmail.com' },
            { role_id: 3, username: 'eka', email: 'eka@gmail.com' },
            { role_id: 4, username: 'kus', email: 'kus@gmail.com' },
            { role_id: 5, username: 'aji', email: 'aji@gmail.com' },
            { role_id: 1, username: 'hana', email: 'hana@gmail.com' },
            { role_id: 2, username: 'heni', email: 'heni@gmail.com' },
            { role_id: 3, username: 'sasaji', email: 'sasajigmail.com' },
            { role_id: 4, username: 'suratno', email: 'suratno@gmail.com' },
            { role_id: 5, username: 'sujatmoko', email: 'sujatmoko@gmail.com' },
            { role_id: 1, username: 'sujatmiko', email: 'sujatmiko@gmail.com' },
            { role_id: 1, username: 'suratman', email: 'suratman@gmail.com' },
            { role_id: 1, username: 'sutaji', email: 'sutaji@gmail.com' },
            { role_id: 1, username: 'sukini', email: 'sukini@gmail.com' },
            { role_id: 1, username: 'zulaeha', email: 'zulaeha@gmail.com' },
            { role_id: 1, username: 'jaelani', email: 'jaelani@gmail.com' },
            { role_id: 1, username: 'xena', email: 'xena@gmail.com' },
            { role_id: 1, username: 'angela', email: 'angela@gmail.com' },
            { role_id: 1, username: 'ling', email: 'ling@gmail.com' },
            { role_id: 1, username: 'karina', email: 'karina@gmail.com' },
            { role_id: 1, username: 'yve', email: 'yve@gmail.com' },
            { role_id: 1, username: 'odette', email: 'odette@gmail.com' },
            { role_id: 1, username: 'helcurt', email: 'helcurt@gmail.com' },
            { role_id: 1, username: 'balmond', email: 'balmond@gmail.com' },
            { role_id: 1, username: 'nana', email: 'nana@gmail.com' },
            { role_id: 1, username: 'valir', email: 'valir@gmail.com' },
            { role_id: 2, username: 'vale', email: 'vale@gmail.com' },
            { role_id: 2, username: 'yuzhong', email: 'yuzhong@gmail.com' },
            { role_id: 2, username: 'lapu', email: 'lapu@gmail.com' },
            { role_id: 2, username: 'fanny', email: 'fanny@gmail.com' },
            { role_id: 2, username: 'hanzo', email: 'hanzo@gmail.com' },
            { role_id: 2, username: 'kagura', email: 'kagura@gmail.com' },
            { role_id: 2, username: 'change', email: 'change@gmail.com' },
            { role_id: 2, username: 'cecillion', email: 'cecillion@gmail.com' },
            { role_id: 2, username: 'carmila', email: 'carmila@gmail.com' },
            { role_id: 2, username: 'gloo', email: 'gloo@gmail.com' },
            { role_id: 2, username: 'fredrin', email: 'fredrin@gmail.com' },
            { role_id: 2, username: 'ferdi', email: 'ferdi@gmail.com' },
            { role_id: 2, username: 'sambo', email: 'sambo@gmail.com' },
        ];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Users table
            for (const data of users) {
                const existingUser = await manager.findOne(User, {
                    where: [{ username: data.username }, { email: data.email }],
                });
                if (!existingUser) {
                    const password = await hashPassword('@Secret123!');
                    const user = new User();
                    user.role_id = data.role_id;
                    user.username = data.username;
                    user.email = data.email;
                    user.password = password;
                    await manager.save(user);
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== PARENTS ===");
        const parents = [
            {
                user_id: 4,
                father: 'Mukhlas',
                mother: 'Sri',
                phone_father: '082234252222',
                phone_mother: '082234253333',
                img_mother: 'img-female.jpg',
                img_father: 'img-male.jpg',
                religion_father: 1,
                religion_mother: 1,
                address: 'Jl Pegangsaan Timur No 10'
            },
            {
                user_id: 9,
                father: 'Mukhlis',
                mother: 'Sri',
                phone_father: '082234252222',
                phone_mother: '082234253333',
                img_mother: 'img-female.jpg',
                img_father: 'img-male.jpg',
                religion_father: 2,
                religion_mother: 2,
                address: 'Jl Pegangsaan Timur No 11'
            },
            {
                user_id: 14,
                father: 'Miko',
                mother: 'Sri',
                phone_father: '082234252222',
                phone_mother: '082234253333',
                img_mother: 'img-female.jpg',
                img_father: 'img-male.jpg',
                religion_father: 3,
                religion_mother: 3,
                address: 'Jl Pegangsaan Timur No 12'
            },
            {
                user_id: 19,
                father: 'Miki',
                mother: 'Sri',
                phone_father: '082234252222',
                phone_mother: '082234253333',
                img_mother: 'img-female.jpg',
                img_father: 'img-male.jpg',
                religion_father: 4,
                religion_mother: 4,
                address: 'Jl Pegangsaan Timur No 13'
            },
            {
                user_id: 24,
                father: 'Mike',
                mother: 'Sri',
                phone_father: '082234252222',
                phone_mother: '082234253333',
                img_mother: 'img-female.jpg',
                img_father: 'img-male.jpg',
                religion_father: 5,
                religion_mother: 5,
                address: 'Jl Pegangsaan Timur No 14'
            },

        ];
        await this.connection.transaction(async (manager) => {
            // // Check duplicates for Parents table
            for (const data of parents) {
                const existingParent = await manager.findOne(Parent, { where: { user_id: data.user_id } });
                if (!existingParent) {
                    const parent = new Parent();
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
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== Teachers ===");
        const teachers = [
            {
                nik: 10001,
                user_id: 2,
                degree_id: 1, // Assuming the Degree ID for a specific degree
                full_name: 'John Doe',
                nick_name: 'JD',
                date_birth: new Date('1990-05-15'),
                place_birth: 'City A',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 1, // Assuming the Religion ID for a specific religion
                phone: '1234567890',
                entry_year: new Date('2015-08-01'),
                address: '123 Main Street, City A',
            },
            {
                nik: 10002,
                user_id: 7,
                degree_id: 2,
                full_name: 'Jane Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10003,
                user_id: 12,
                degree_id: 3,
                full_name: 'Jade Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10004,
                user_id: 17,
                degree_id: 4,
                full_name: 'Jase Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10005,
                user_id: 22,
                degree_id: 5,
                full_name: 'Jame Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10006,
                user_id: 42,
                degree_id: 5,
                full_name: 'Jase Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10007,
                user_id: 43,
                degree_id: 5,
                full_name: 'Jaqe Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10008,
                user_id: 44,
                degree_id: 5,
                full_name: 'Jare Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10009,
                user_id: 45,
                degree_id: 5,
                full_name: 'Jake Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10010,
                user_id: 46,
                degree_id: 5,
                full_name: 'Jale Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10011,
                user_id: 47,
                degree_id: 5,
                full_name: 'Jaye Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10012,
                user_id: 48,
                degree_id: 5,
                full_name: 'Jase Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10013,
                user_id: 49,
                degree_id: 5,
                full_name: 'Jase Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10014,
                user_id: 50,
                degree_id: 5,
                full_name: 'Jase Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10015,
                user_id: 51,
                degree_id: 5,
                full_name: 'Jage Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10016,
                user_id: 52,
                degree_id: 5,
                full_name: 'Jafe Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10017,
                user_id: 53,
                degree_id: 5,
                full_name: 'Jave Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                nik: 10018,
                user_id: 54,
                degree_id: 5,
                full_name: 'Jahe Smith',
                nick_name: 'JS',
                date_birth: new Date('1985-11-25'),
                place_birth: 'City B',
                gender_id: 2,
                religion_id: 2,
                phone: '9876543210',
                entry_year: new Date('2010-09-01'),
                address: '456 Elm Street, City B',
            },
        ]
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Religion table
            for (const data of teachers) {
                const existingTeacher = await manager.findOne(Teacher, { where: { nik: data.nik } });
                if (!existingTeacher) {
                    const teacher = new Teacher();
                    teacher.nik = data.nik;
                    teacher.user_id = data.user_id;
                    teacher.degree_id = data.degree_id;
                    teacher.full_name = data.full_name;
                    teacher.nick_name = data.nick_name;
                    teacher.date_birth = data.date_birth;
                    teacher.place_birth = data.place_birth;
                    teacher.gender_id = data.gender_id;
                    teacher.religion_id = data.religion_id;
                    teacher.phone = data.phone;
                    teacher.entry_year = data.entry_year;
                    teacher.address = data.address;
                    await manager.save(teacher);
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== Student ===");
        const students = [
            {
                parent_id: 1, // Assuming the Parent ID for this student
                user_id: 1, // Assuming the User ID for this student
                nis: 17316084,
                full_name: 'Agung Pangestu',
                nick_name: 'Agung',
                date_birth: new Date('2005-05-15'),
                place_birth: 'City A',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 1, // Assuming the Religion ID for a specific religion
                phone: '1234567890',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2018-08-01'),
                address: '123 Main Street, City A',
            },
            {
                parent_id: 2, // Assuming the Parent ID for this student
                user_id: 6, // Assuming the User ID for this student
                nis: 17316085,
                full_name: 'Yulian Khadafi',
                nick_name: 'Yulian',
                date_birth: new Date('2006-11-25'),
                place_birth: 'City B',
                gender_id: 2, // Assuming the Gender ID for a specific gender
                religion_id: 2, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 1,
                child_order: 2,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 3, // Assuming the Parent ID for this student
                user_id: 11, // Assuming the User ID for this student
                nis: 17316086,
                full_name: 'Siska Evi Yantika',
                nick_name: 'Siska',
                date_birth: new Date('2001-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 3,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 4, // Assuming the Parent ID for this student
                user_id: 17, // Assuming the User ID for this student
                nis: 17316087,
                full_name: 'Intan Purnama Sari',
                nick_name: 'Intan',
                date_birth: new Date('2002-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 3,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 22, // Assuming the User ID for this student
                nis: 17316088,
                full_name: 'Heni Setiawati',
                nick_name: 'Heni',
                date_birth: new Date('2003-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 26, // Assuming the User ID for this student
                nis: 17316089,
                full_name: 'Sujatmiko Dae',
                nick_name: 'Sujatmiko',
                date_birth: new Date('2000-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 27, // Assuming the User ID for this student
                nis: 17316090,
                full_name: 'Suratman Mike',
                nick_name: 'Suratman',
                date_birth: new Date('2001-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 28, // Assuming the User ID for this student
                nis: 17316091,
                full_name: 'Sutaji Bie',
                nick_name: 'Sutaji',
                date_birth: new Date('2002-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 29, // Assuming the User ID for this student
                nis: 17316092,
                full_name: 'Sukini Ulaa',
                nick_name: 'Sukini',
                date_birth: new Date('2003-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 30, // Assuming the User ID for this student
                nis: 17316093,
                full_name: 'Zulaeha Anggraeni',
                nick_name: 'Zulaeha',
                date_birth: new Date('2004-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 31, // Assuming the User ID for this student
                nis: 17316094,
                full_name: 'Jaelani Anum',
                nick_name: 'Jaelani',
                date_birth: new Date('2001-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 32, // Assuming the User ID for this student
                nis: 17316095,
                full_name: 'Xena Ananta',
                nick_name: 'Xena',
                date_birth: new Date('2002-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 33, // Assuming the User ID for this student
                nis: 17316096,
                full_name: 'Angela Karamoy',
                nick_name: 'Angela',
                date_birth: new Date('2003-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 34, // Assuming the User ID for this student
                nis: 17316097,
                full_name: 'Ling Soe King',
                nick_name: 'Ling',
                date_birth: new Date('2004-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 35, // Assuming the User ID for this student
                nis: 17316098,
                full_name: 'Karina Amoe',
                nick_name: 'Karina',
                date_birth: new Date('2001-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 36, // Assuming the User ID for this student
                nis: 17316099,
                full_name: 'Yve Uve',
                nick_name: 'Yve',
                date_birth: new Date('2002-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 37, // Assuming the User ID for this student
                nis: 17316100,
                full_name: 'Odette Korn',
                nick_name: 'Odette',
                date_birth: new Date('2003-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 38, // Assuming the User ID for this student
                nis: 17316101,
                full_name: 'Helcurt Boo',
                nick_name: 'Helcurt',
                date_birth: new Date('2004-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 39, // Assuming the User ID for this student
                nis: 17316102,
                full_name: 'Balmond Brad',
                nick_name: 'Balmond',
                date_birth: new Date('2001-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 40, // Assuming the User ID for this student
                nis: 17316103,
                full_name: 'Nana Najwa',
                nick_name: 'Nana',
                date_birth: new Date('2002-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
            {
                parent_id: 5, // Assuming the Parent ID for this student
                user_id: 41, // Assuming the User ID for this student
                nis: 17316104,
                full_name: 'Valir Bert',
                nick_name: 'Valir',
                date_birth: new Date('2003-11-25'),
                place_birth: 'City B',
                gender_id: 1, // Assuming the Gender ID for a specific gender
                religion_id: 4, // Assuming the Religion ID for a specific religion
                phone: '9876543210',
                siblings: 2,
                child_order: 1,
                entry_year: new Date('2019-09-01'),
                address: '456 Elm Street, City B',
            },
        ];
        await this.connection.transaction(async (manager) => {
            for (const data of students) {
                const existingStudent = await manager.findOne(Student, { where: { nis: data.nis } });
                if (!existingStudent) {
                    const student = new Student();
                    student.parent_id = data.parent_id;
                    student.user_id = data.user_id;
                    student.nis = data.nis;
                    student.full_name = data.full_name;
                    student.nick_name = data.nick_name;
                    student.date_birth = data.date_birth;
                    student.place_birth = data.place_birth;
                    student.gender_id = data.gender_id;
                    student.religion_id = data.religion_id;
                    student.phone = data.phone;
                    student.siblings = data.siblings;
                    student.child_order = data.child_order;
                    student.entry_year = data.entry_year;
                    student.address = data.address;
                    await manager.save(student);
                } else {
                    console.log(`Skipping...`);
                }
            }
        })

        console.log("=== CLASS ===");
        const classes = [
            { class: "X IPA 1", classroom_id: 1, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "X IPA 1", classroom_id: 1, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "X IPA 2", classroom_id: 2, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "X IPA 2", classroom_id: 2, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "X IPA 3", classroom_id: 3, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "X IPA 3", classroom_id: 3, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "X IPS 1", classroom_id: 4, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "X IPS 1", classroom_id: 4, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "X IPS 2", classroom_id: 5, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "X IPS 2", classroom_id: 5, teacher_id: 5, subject_id: 20, max_student: 20 },


            { class: "XI IPA 1", classroom_id: 6, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XI IPA 1", classroom_id: 6, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "XI IPA 2", classroom_id: 7, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XI IPA 2", classroom_id: 7, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "XI IPA 3", classroom_id: 8, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XI IPA 3", classroom_id: 8, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "XI IPS 1", classroom_id: 9, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XI IPS 1", classroom_id: 9, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "XI IPS 2", classroom_id: 10, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XI IPS 2", classroom_id: 10, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "XII IPA 1", classroom_id: 11, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XII IPA 1", classroom_id: 11, teacher_id: 5, subject_id: 20, max_student: 20 },


            { class: "XII IPA 2", classroom_id: 12, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XII IPA 2", classroom_id: 12, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "XII IPA 3", classroom_id: 13, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XII IPA 3", classroom_id: 13, teacher_id: 5, subject_id: 20, max_student: 20 },

            { class: "XII IPS 1", classroom_id: 15, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XII IPS 1", classroom_id: 15, teacher_id: 5, subject_id: 20, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 1, subject_id: 1, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 2, subject_id: 2, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 3, subject_id: 3, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 4, subject_id: 4, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 5, subject_id: 5, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 1, subject_id: 6, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 2, subject_id: 7, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 3, subject_id: 8, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 4, subject_id: 9, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 5, subject_id: 10, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 1, subject_id: 11, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 2, subject_id: 12, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 3, subject_id: 13, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 4, subject_id: 14, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 5, subject_id: 15, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 1, subject_id: 16, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 2, subject_id: 17, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 3, subject_id: 18, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 4, subject_id: 19, max_student: 20 },
            { class: "XII IPS 2", classroom_id: 16, teacher_id: 5, subject_id: 20, max_student: 20 },
        ];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Religion table
            for (const data of classes) {
                const existingClass = await manager.findOne(Class, { where: { class: data.class, classroom_id: data.classroom_id, teacher_id: data.classroom_id, subject_id: data.subject_id } });
                if (!existingClass) {
                    const singleClass = new Class();
                    singleClass.class = data.class;
                    singleClass.classroom_id = data.classroom_id;
                    singleClass.teacher_id = data.teacher_id;
                    singleClass.subject_id = data.subject_id;
                    singleClass.max_students = data.max_student;
                    await manager.save(singleClass);
                } else {
                    console.log(`Skipping...`);
                }
            }
        })

        console.log("=== SCHEDULE ===");
        const schedules = [
            // Monday
            { schedule_code: 'A001', day_of_week: 'Monday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 1, },
            { schedule_code: 'A002', day_of_week: 'Monday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 2, },
            { schedule_code: 'A003', day_of_week: 'Monday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 3, },
            // Tuesday
            { schedule_code: 'A004', day_of_week: 'Tuesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 4, },
            { schedule_code: 'A005', day_of_week: 'Tuesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 5, },
            { schedule_code: 'A006', day_of_week: 'Tuesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 6, },
            // Wednesday
            { schedule_code: 'A007', day_of_week: 'Wednesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 7, },
            { schedule_code: 'A008', day_of_week: 'Wednesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 8, },
            { schedule_code: 'A009', day_of_week: 'Wednesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 9, },
            // Thursday
            { schedule_code: 'A010', day_of_week: 'Thursday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 10, },
            { schedule_code: 'A011', day_of_week: 'Thursday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 11, },
            { schedule_code: 'A012', day_of_week: 'Thursday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 12, },
            // Friday
            { schedule_code: 'A013', day_of_week: 'Friday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 13, },
            { schedule_code: 'A014', day_of_week: 'Friday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 14, },
            { schedule_code: 'A015', day_of_week: 'Friday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 15, },
            // Saturday
            { schedule_code: 'A016', day_of_week: 'Saturday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 16, },
            { schedule_code: 'A017', day_of_week: 'Saturday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 17, },
            { schedule_code: 'A018', day_of_week: 'Saturday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 18, },


            { schedule_code: 'B001', day_of_week: 'Monday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 19, },
            { schedule_code: 'B002', day_of_week: 'Monday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 20, },
            { schedule_code: 'B003', day_of_week: 'Monday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 21, },
            // Tuesday
            { schedule_code: 'B004', day_of_week: 'Tuesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 22, },
            { schedule_code: 'B005', day_of_week: 'Tuesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 23, },
            { schedule_code: 'B006', day_of_week: 'Tuesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 24, },
            // Wednesday
            { schedule_code: 'B007', day_of_week: 'Wednesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 25, },
            { schedule_code: 'B008', day_of_week: 'Wednesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 26, },
            { schedule_code: 'B009', day_of_week: 'Wednesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 27, },
            // Thursday
            { schedule_code: 'B010', day_of_week: 'Thursday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 28, },
            { schedule_code: 'B011', day_of_week: 'Thursday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 29, },
            { schedule_code: 'B012', day_of_week: 'Thursday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 30, },
            // Friday
            { schedule_code: 'B013', day_of_week: 'Friday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 31, },
            { schedule_code: 'B014', day_of_week: 'Friday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 32, },
            { schedule_code: 'B015', day_of_week: 'Friday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 33, },
            // Saturday
            { schedule_code: 'B016', day_of_week: 'Saturday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 34, },
            { schedule_code: 'B017', day_of_week: 'Saturday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 35, },
            { schedule_code: 'B018', day_of_week: 'Saturday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 36, },

            { schedule_code: 'C001', day_of_week: 'Monday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 37, },
            { schedule_code: 'C002', day_of_week: 'Monday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 38, },
            { schedule_code: 'C003', day_of_week: 'Monday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 39, },
            // Tuesday
            { schedule_code: 'C004', day_of_week: 'Tuesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 40, },
            { schedule_code: 'C005', day_of_week: 'Tuesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 41, },
            { schedule_code: 'C006', day_of_week: 'Tuesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 42, },
            // Wednesday
            { schedule_code: 'C007', day_of_week: 'Wednesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 43, },
            { schedule_code: 'C008', day_of_week: 'Wednesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 44, },
            { schedule_code: 'C009', day_of_week: 'Wednesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 45, },
            // Thursday
            { schedule_code: 'C010', day_of_week: 'Thursday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 46, },
            { schedule_code: 'C011', day_of_week: 'Thursday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 47, },
            { schedule_code: 'C012', day_of_week: 'Thursday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 48, },
            // Friday
            { schedule_code: 'C013', day_of_week: 'Friday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 49, },
            { schedule_code: 'C014', day_of_week: 'Friday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 50, },
            { schedule_code: 'C015', day_of_week: 'Friday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 51, },
            // Saturday
            { schedule_code: 'C016', day_of_week: 'Saturday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 52, },
            { schedule_code: 'C017', day_of_week: 'Saturday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 53, },
            { schedule_code: 'C018', day_of_week: 'Saturday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 54, },

            { schedule_code: 'D001', day_of_week: 'Monday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 55, },
            { schedule_code: 'D002', day_of_week: 'Monday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 56, },
            { schedule_code: 'D003', day_of_week: 'Monday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 57, },
            // Tuesday
            { schedule_code: 'D004', day_of_week: 'Tuesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 58, },
            { schedule_code: 'D005', day_of_week: 'Tuesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 59, },
            { schedule_code: 'D006', day_of_week: 'Tuesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 60, },
            // Wednesday
            { schedule_code: 'D007', day_of_week: 'Wednesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 61, },
            { schedule_code: 'D008', day_of_week: 'Wednesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 62, },
            { schedule_code: 'D009', day_of_week: 'Wednesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 63, },
            // Thursday
            { schedule_code: 'D010', day_of_week: 'Thursday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 64, },
            { schedule_code: 'D011', day_of_week: 'Thursday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 65, },
            { schedule_code: 'D012', day_of_week: 'Thursday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 66, },
            // Friday
            { schedule_code: 'D013', day_of_week: 'Friday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 67, },
            { schedule_code: 'D014', day_of_week: 'Friday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 68, },
            { schedule_code: 'D015', day_of_week: 'Friday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 69, },
            // Saturday
            { schedule_code: 'D016', day_of_week: 'Saturday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 70, },
            { schedule_code: 'D017', day_of_week: 'Saturday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 71, },
            { schedule_code: 'D018', day_of_week: 'Saturday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 72, },

            { schedule_code: 'E001', day_of_week: 'Monday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 73, },
            { schedule_code: 'E002', day_of_week: 'Monday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 74, },
            { schedule_code: 'E003', day_of_week: 'Monday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 75, },
            // Tuesday
            { schedule_code: 'E004', day_of_week: 'Tuesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 76, },
            { schedule_code: 'E005', day_of_week: 'Tuesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 77, },
            { schedule_code: 'E006', day_of_week: 'Tuesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 78, },
            // Wednesday
            { schedule_code: 'E007', day_of_week: 'Wednesday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 79, },
            { schedule_code: 'E008', day_of_week: 'Wednesday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 80, },
            { schedule_code: 'E009', day_of_week: 'Wednesday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 81, },
            // Thursday
            { schedule_code: 'E010', day_of_week: 'Thursday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 82, },
            { schedule_code: 'E011', day_of_week: 'Thursday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 83, },
            { schedule_code: 'E012', day_of_week: 'Thursday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 84, },
            // Friday
            { schedule_code: 'E013', day_of_week: 'Friday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 85, },
            { schedule_code: 'E014', day_of_week: 'Friday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 86, },
            { schedule_code: 'E015', day_of_week: 'Friday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 87, },
            // Saturday
            { schedule_code: 'E016', day_of_week: 'Saturday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 88, },
            { schedule_code: 'E017', day_of_week: 'Saturday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 89, },
            { schedule_code: 'E018', day_of_week: 'Saturday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 90, },
        ];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for SCHEDULE table
            for (const data of schedules) {
                const existingSchedule = await manager.findOne(Schedule, { where: { schedule_code: data.schedule_code } });
                if (!existingSchedule) {
                    const schedule = new Schedule();
                    schedule.schedule_code = data.schedule_code;
                    schedule.day_of_week = data.day_of_week;
                    schedule.time_start = data.time_start;
                    schedule.time_finish = data.time_finish;
                    schedule.class_id = data.class_id;
                    await manager.save(schedule);
                } else {
                    console.log(`Skipping...`);
                }
            };
        });

        console.log("=== Enrolment ===");
        for (let i = 1; i <= 21; i++) {
            for (let j = 1; j <= 90; j++) {
                const a = i + "-" + j;
                const enrolments = { enrol_code: a, student_id: i, schedule_id: j, enrolment_date: new Date('2023-08-01 10:00:00'), enrolment_status: true };
                await this.connection.transaction(async (manager) => {
                    const existingEnrolment = await manager.findOne(Enrolment, { where: { enrol_code: enrolments.enrol_code } });
                    if (!existingEnrolment) {
                        const schedule = new Enrolment();
                        schedule.enrol_code = enrolments.enrol_code;
                        schedule.student_id = enrolments.student_id;
                        schedule.schedule_id = enrolments.schedule_id;
                        schedule.enrolment_date = enrolments.enrolment_date;
                        schedule.enrolment_status = enrolments.enrolment_status;
                        await manager.save(schedule);
                    } else {
                        console.log(`Skipping...`);
                    }
                });
            }
        }

        console.log("=== PERMISSIONS ===");
        const permissions = [
            { code: "CU", description: "Create User" },
            { code: "RU", description: "Read User" },
            { code: "UU", description: "Update User" },
            { code: "DU", description: "Delete User" },

            { code: "CC", description: "Create Class" },
            { code: "RC", description: "Read Class" },
            { code: "UC", description: "Update Class" },
            { code: "DC", description: "Delete Class" },

            { code: "CCR", description: "Create Class Room" },
            { code: "RCR", description: "Read Class Room" },
            { code: "UCR", description: "Update Class Room" },
            { code: "DCR", description: "Delete Class Room" },

            { code: "CE", description: "Create Enrolments" },
            { code: "RE", description: "Read Enrolments" },
            { code: "UE", description: "Update Enrolments" },
            { code: "DE", description: "Delete Enrolments" },

            { code: "CD", description: "Create Degree" },
            { code: "RD", description: "Read Degree" },
            { code: "UD", description: "Update Degree" },
            { code: "DD", description: "Delete Degree" },

            { code: "CPR", description: "Create Parent" },
            { code: "RPR", description: "Read Parent" },
            { code: "UPR", description: "Update Parent" },
            { code: "DPR", description: "Delete Parent" },

            { code: "CRE", description: "Create Religion" },
            { code: "RRE", description: "Read Religion" },
            { code: "URE", description: "Update Religion" },
            { code: "DRE", description: "Delete Religion" },

            { code: "CRP", description: "Create Role Permission" },
            { code: "RRP", description: "Read Role Permission" },
            { code: "URP", description: "Update Role Permission" },
            { code: "DRP", description: "Delete Role Permission" },

            { code: "CR", description: "Create Role" },
            { code: "RR", description: "Read Role" },
            { code: "UR", description: "Update Role" },
            { code: "DR", description: "Delete Role" },

            { code: "CP", description: "Create Permission" },
            { code: "RP", description: "Read Permission" },
            { code: "UP", description: "Update Permission" },
            { code: "DP", description: "Delete Permission" },

            { code: "CSC", description: "Create Schedule" },
            { code: "RSC", description: "Read Schedule" },
            { code: "USC", description: "Update Schedule" },
            { code: "DSC", description: "Delete Schedule" },

            { code: "CST", description: "Create Student" },
            { code: "RST", description: "Read Student" },
            { code: "UST", description: "Update Student" },
            { code: "DST", description: "Delete Student" },

            { code: "CSB", description: "Create Subject" },
            { code: "RSB", description: "Read Subject" },
            { code: "USB", description: "Update Subject" },
            { code: "DSB", description: "Delete Subject" },

            { code: "CT", description: "Create Teacher" },
            { code: "RT", description: "Read Teacher" },
            { code: "UT", description: "Update Teacher" },
            { code: "DT", description: "Delete Teacher" },

            { code: "CSP", description: "Create User Permission" },
            { code: "RSP", description: "Read User Permission" },
            { code: "USP", description: "Update User Permission" },
            { code: "DSP", description: "Delete User Permission" },

            { code: "CPP", description: "Create User Profile" },
            { code: "RPP", description: "Read User Profile" },
            { code: "UPP", description: "Update User Profile" },
            { code: "DPP", description: "Delete User Profile" },

        ];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for PERMISSIONS table
            for (const data of permissions) {
                const existingPermission = await manager.findOne(Permission, { where: { code: data.code } });
                if (!existingPermission) {
                    const permission = new Permission();
                    permission.code = data.code;
                    permission.description = data.description;
                    await manager.save(permission);
                } else {
                    console.log(`Skipping...`);
                }
            };
        });

        console.log("=== ROLE PERMISSION ===")
        const userPermission = [13, 14, 15, 21, 22, 23, 61, 62, 63];
        const teacherPermission = [5, 6, 7, 8, 9, 10, 11, 12, 41, 42, 43, 44,];
        await this.connection.transaction(async (manager) => {
            // Check duplicates for PERMISSIONS table
            for (let index = 1; index < 61; index++) {
                const existingPermission = await manager.findOne(RolePermission, { where: { role_id: 3, permission_id: index } });
                if (!existingPermission) {
                    const rp = new RolePermission();
                    rp.role_id = 3;
                    rp.permission_id = index;
                    await manager.save(rp);
                } else {
                    console.log(`Skipping...`);
                }
            }

            for (const data of teacherPermission) {
                const existingPermission = await manager.findOne(RolePermission, { where: { role_id: 2, permission_id: data } });
                if (!existingPermission) {
                    const rp = new RolePermission();
                    rp.role_id = 2;
                    rp.permission_id = data;
                    await manager.save(rp);
                } else {
                    console.log(`Skipping...`);
                }
            }

            for (const data of userPermission) {
                const existingPermission = await manager.findOne(RolePermission, { where: { role_id: 1, permission_id: data } });
                if (!existingPermission) {
                    const rp = new RolePermission();
                    rp.role_id = 1;
                    rp.permission_id = data;
                    await manager.save(rp);
                } else {
                    console.log(`Skipping...`);
                }
            }
        });

        console.log("=== METADATA-ENROLMENTS ===")
        for (let i; i < 5; i++) {

        }
        console.log("=== Finish ===");
    }
}









