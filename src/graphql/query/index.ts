export const login = gql`
	query login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				email
				name
				avatar
			}
		}
	}
`

export const register = gql`
	query register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			token
			user {
				id
				email
				name
				avatar
			}
		}
	}
`
