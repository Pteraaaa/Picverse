export class UserBuilder {
    private user: any = {};

    setName(name: string): UserBuilder {
        this.user.name = name;

        return this;
    }

    setEmail(email: string): UserBuilder {
        this.user.email = email;

        return this;
    }

    setPassword(password: string): UserBuilder {
        this.user.password = password;

        return this;
    }

    build() {
        if (
            !this.user.name ||
            !this.user.email ||
            !this.user.password
        ) {
            throw new Error(
                'Missing required user fields',
            );
        }

        return this.user;
    }
}