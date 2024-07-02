export const login = gql`
	query Login($email: String!, $password: String!) {
		auth(email: $email, password: $password) {
			token
		}
	}
`

export const register = gql`
	mutation Register($email: String!, $password: String!, $role: String!) {
		register(email: $email, password: $password, role: $role) {
			token
		}
	}
`
