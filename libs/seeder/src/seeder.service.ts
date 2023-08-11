import { Injectable } from '@nestjs/common';
import { hashPassword } from '@app/jwt-libs';
import { User } from 'src/users/entities/user.entity';
import { Gender } from 'src/users/entities/gender.entity';
import { Religion } from 'src/users/entities/religion.entity';
import { Degree } from 'src/teachers/entities/degree.entity';
import { Role } from 'src/users/entities/role.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Connection } from 'typeorm';
import { Class, Classroom, Subject } from 'src/classrooms/entities/classroom.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Student } from 'src/students/entities/student.entity';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';

@Injectable()
export class SeederService {
    constructor(private readonly connection: Connection) { }

    async seed() {
        const genders = [
            { gender: 'Laki-laki' },
            { gender: 'Perempuan' },
        ];
        console.log("=== GENDER ===");
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Gender table
            for (const data of genders) {
                const existingGender = await manager.findOne(Gender, { where: { gender: data.gender } });
                if (!existingGender) {
                    const gender = new Gender();
                    gender.gender = data.gender;
                    await manager.save(gender);
                } else {
                    console.log(`Gender with value ${data.gender} already exists. Skipping...`);
                }
            }
        });

        const classrooms = [
            { clasroom: 'Ruang 101 A' },
            { clasroom: 'Ruang 102 A' },
            { clasroom: 'Ruang 103 A' },
            { clasroom: 'Ruang 104 A' },
            { clasroom: 'Ruang 105 A' },
            { clasroom: 'Ruang 201 A' },
            { clasroom: 'Ruang 202 A' },
            { clasroom: 'Ruang 203 A' },
            { clasroom: 'Ruang 204 A' },
            { clasroom: 'Ruang 205 A' },
            { clasroom: 'Ruang 101 B' },
            { clasroom: 'Ruang 102 B' },
            { clasroom: 'Ruang 103 B' },
            { clasroom: 'Ruang 104 B' },
            { clasroom: 'Ruang 105 B' },
            { clasroom: 'Ruang 201 B' },
            { clasroom: 'Ruang 202 B' },
            { clasroom: 'Ruang 203 B' },
            { clasroom: 'Ruang 204 B' },
            { clasroom: 'Ruang 205 B' },
        ];

        console.log("=== CLASSROOM ===");
        await this.connection.transaction(async (manager) => {
            //Check duplicates for Classroom table
            for (const data of classrooms) {
                const existingClassrom = await manager.findOne(Classroom, { where: { classroom: data.clasroom } });
                if (!existingClassrom) {
                    const classroom = new Classroom();
                    classroom.classroom = data.clasroom;
                    await manager.save(classroom)
                } else {
                    console.log(`Classrooms with value ${data.clasroom} already exists. Skipping...`);
                }
            }
        });

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

        console.log("=== SUBJECTS ===");
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
                    console.log(`Subject with value ${data.subject} already exists. Skipping...`);
                }
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

        console.log("=== RELIGIONS ===");
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Religion table
            for (const data of religions) {
                const existingReligion = await manager.findOne(Religion, { where: { religion: data.religion } });
                if (!existingReligion) {
                    const religion = new Religion();
                    religion.religion = data.religion;
                    await manager.save(religion);
                } else {
                    console.log(`Religion with value ${data.religion} already exists. Skipping...`);
                }
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

        console.log("=== DEGREES ===");
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Degree table
            for (const data of degrees) {
                const existingDegree = await manager.findOne(Degree, { where: { degree: data.degree } });
                if (!existingDegree) {
                    const degree = new Degree();
                    degree.degree = data.degree;
                    await manager.save(degree);
                } else {
                    console.log(`Degree with value ${data.degree} already exists. Skipping...`);
                }
            }
        });

        const roles = [
            { role: 'Siswa' },
            { role: 'Guru' },
            { role: 'Staff' },
            { role: 'Orang Tua' },
            { role: 'Kepala Sekolah' },
        ];

        console.log("=== ROLES ===");
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Roles table
            for (const data of roles) {
                const existingRole = await manager.findOne(Role, { where: { role: data.role } });
                if (!existingRole) {
                    const role = new Role();
                    role.role = data.role;
                    await manager.save(role);
                } else {
                    console.log(`Role with value ${data.role} already exists. Skipping...`);
                }
            }
        });

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
        ];

        console.log("=== USERS ===");
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
                    console.log(`User with username ${data.username} or email ${data.email} already exists. Skipping...`);
                }
            }
        });

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
        console.log("=== PARENTS ===");
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
                    console.log(`Parent with user_id ${data.user_id} already exists. Skipping...`);
                }
            }
        });

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
        ]

        console.log("=== Teachers ===");
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
                    console.log(`Religion with value ${data.nik} already exists. Skipping...`);
                }
            }
        });

        const students = [
            {
                parent_id: 1, // Assuming the Parent ID for this student
                user_id: 1, // Assuming the User ID for this student
                nis: 17316084,
                full_name: 'Agung Pangestu',
                nick_name: 'AP',
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
                full_name: 'Pangestu Agung',
                nick_name: 'PA',
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
                full_name: 'PPPPPPPPPPPPP',
                nick_name: 'P',
                date_birth: new Date('2006-11-25'),
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
                full_name: 'PPPPPPPPPPPPP',
                nick_name: 'P',
                date_birth: new Date('2006-11-25'),
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
                full_name: 'MMMMMMMMMM',
                nick_name: 'M',
                date_birth: new Date('2006-11-25'),
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
        console.log("=== Student ===");

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
                    console.log(`student with value ${data.nis} already exists. Skipping...`);
                }
            }
        })

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

        console.log("=== CLASS ===");
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
                    console.log(`CLASS with value ${data.class} already exists. Skipping...`);
                }
            }
        })
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
            { schedule_code: 'A016', day_of_week: 'Saturday', time_start: '07:30:00', time_finish: '09:30:00', class_id: 1, },
            { schedule_code: 'A017', day_of_week: 'Saturday', time_start: '10:00:00', time_finish: '11:00:00', class_id: 2, },
            { schedule_code: 'A018', day_of_week: 'Saturday', time_start: '13:00:00', time_finish: '13:45:00', class_id: 3, },
        ];
        console.log("=== SCHEDULE ===");
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Users table
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
                    console.log(`SCHEDULE with value ${data.schedule_code} already exists. Skipping...`);
                }
            };
        });

        const enrolments = [
            { enrol_code: "1-1", student_id: 1, class_id: 1, enrolment_date: new Date('2023-08-01 10:00:00'), enrolment_status: true },
            { enrol_code: "2-1", student_id: 2, class_id: 1, enrolment_date: new Date('2023-08-01 10:00:00'), enrolment_status: true },
            { enrol_code: "1-2", student_id: 1, class_id: 2, enrolment_date: new Date('2023-08-01 10:00:00'), enrolment_status: true },
            { enrol_code: "2-2", student_id: 2, class_id: 2, enrolment_date: new Date('2023-08-01 10:00:00'), enrolment_status: true },
        ];
        console.log("=== Enrolment ===");
        await this.connection.transaction(async (manager) => {
            // Check duplicates for Users table
            for (const data of enrolments) {
                const existingEnrolment = await manager.findOne(Enrolment, { where: { enrol_code: data.enrol_code } });
                if (!existingEnrolment) {
                    const schedule = new Enrolment();
                    schedule.enrol_code = data.enrol_code;
                    schedule.student_id = data.student_id;
                    schedule.class_id = data.class_id;
                    schedule.enrolment_date = data.enrolment_date;
                    schedule.enrolment_status = data.enrolment_status;
                    await manager.save(schedule);
                } else {
                    console.log(`Enrolment with value ${data.enrol_code} already exists. Skipping...`);
                }
            };
        });


        console.log("=== Finish ===");
    }
}









