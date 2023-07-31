import { hashPassword } from "@app/jwt-libs"

const password = hashPassword("@Secret123");
export const queryUsers = `
    INSERT INTO users
    (role_id, username, email, passowrd)
    VALUES
    ("1", "maris","maris@icloud.org", ${password});
    ("2", "emery","emery@icloud.org", ${password});
    ("3", "desiree","desiree@icloud.org", ${password});
    ("4", "samantha","samantha@icloud.org", ${password});
    ("1", "lila","lila@icloud.org", ${password});
    ("2", "molly","molly@icloud.org", ${password});
`
export const queryRoles = `
    INSERT INTO
    roles
    (role)
    VALUES
    ("Students");
    ("Teachers");
    ("Staff");
    ("Parents");
`

export const queryReligion = `
    INSERT INTO religion
    (religion)
    VALUES
    ("Budha");
    ("Hindu");
    ("Islam");
    ("Kristen Katolik");
    ("Kristen Protestan");
    ("Konghucu");
`;

export const queryGender = `
    
`;