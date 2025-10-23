import { toast } from "@/hooks/use-toast";

// Simulated delay to mimic API calls
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

export interface MockLoginRequest {
    email: string;
    password: string;
}

export interface MockRegisterRequest {
    email: string;
    password: string;
    name: string;
    role: 'assets' | 'maintenance' | 'reliability';
}

export interface MockLoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: 'assets' | 'maintenance' | 'reliability';
        name: string;
    };
}

export interface MockUser {
    id: string;
    email: string;
    role: 'assets' | 'maintenance' | 'reliability';
    name: string;
}

// Mock users database
const mockUsers: MockUser[] = [
    {
        id: "1",
        email: "admin@assetai.com",
        role: "assets",
        name: "John Smith",
    },
    {
        id: "2",
        email: "maintenance@assetai.com",
        role: "maintenance",
        name: "Sarah Johnson",
    },
    {
        id: "3",
        email: "reliability@assetai.com",
        role: "reliability",
        name: "Mike Davis",
    },
];

// Mock authentication API
export const mockAuthApi = {
    // Login user
    async login(credentials: MockLoginRequest): Promise<MockLoginResponse> {
        console.log("🔄 Mock Auth API: Attempting login for", credentials.email);
        await simulateDelay();

        // Simple validation - in development, accept any email/password combination
        if (!credentials.email || !credentials.password) {
            throw new Error("Email and password are required");
        }

        if (credentials.password.length < 6) {
            throw new Error("Invalid credentials");
        }

        // Find existing user or create a default one
        let user = mockUsers.find(u => u.email === credentials.email);
        if (!user) {
            // Create a default user if not found
            user = {
                id: Date.now().toString(),
                email: credentials.email,
                role: "assets", // Default role
                name: credentials.email.split("@")[0],
            };
            mockUsers.push(user);
        }

        const mockToken = `mock_token_${user.id}_${Date.now()}`;

        console.log("✅ Mock Auth API: Login successful for", user.name);

        toast({
            title: "Login Successful",
            description: `Welcome back, ${user.name}! (Mock Mode)`,
        });

        return {
            token: mockToken,
            user,
        };
    },

    // Register user
    async register(userData: MockRegisterRequest): Promise<MockLoginResponse> {
        console.log("🔄 Mock Auth API: Creating account for", userData.email);
        await simulateDelay(1200);

        // Check if user already exists
        if (mockUsers.find(u => u.email === userData.email)) {
            throw new Error("User with this email already exists");
        }

        // Create new user
        const newUser: MockUser = {
            id: Date.now().toString(),
            email: userData.email,
            role: userData.role,
            name: userData.name,
        };

        mockUsers.push(newUser);
        const mockToken = `mock_token_${newUser.id}_${Date.now()}`;

        console.log("✅ Mock Auth API: Account created successfully for", newUser.name);

        toast({
            title: "Account Created",
            description: `Welcome to AssetAI Platform, ${newUser.name}! (Mock Mode)`,
        });

        return {
            token: mockToken,
            user: newUser,
        };
    },

    // Logout user
    async logout(): Promise<void> {
        console.log("🔄 Mock Auth API: Logging out user");
        await simulateDelay(500);
        console.log("✅ Mock Auth API: Logout successful");

        toast({
            title: "Logged Out",
            description: "You have been successfully logged out. (Mock Mode)",
        });
    },

    // Get current user profile
    async getProfile(): Promise<MockUser> {
        console.log("🔄 Mock Auth API: Fetching user profile");
        await simulateDelay();

        // For mock mode, return a default profile based on stored role
        const storedRole = localStorage.getItem('userRole') as 'assets' | 'maintenance' | 'reliability' || 'assets';
        const mockProfile: MockUser = {
            id: "mock_user_id",
            email: "demo@assetai.com",
            role: storedRole,
            name: "Demo User",
        };

        console.log("✅ Mock Auth API: Profile fetched", mockProfile);
        return mockProfile;
    },

    // Refresh token
    async refreshToken(): Promise<{ token: string }> {
        console.log("🔄 Mock Auth API: Refreshing token");
        await simulateDelay();

        const newToken = `mock_token_refreshed_${Date.now()}`;
        console.log("✅ Mock Auth API: Token refreshed");

        return { token: newToken };
    },
};