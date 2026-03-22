import Foundation

enum DiscoverMockUsers {
    /// Sample data for demos; replace with network results later.
    static let all: [DiscoverUser] = [
        DiscoverUser(
            id: UUID(),
            name: "Morgan Lee",
            bio: "Building thoughtful mobile experiences. Coffee, SwiftUI, and clear copy.",
            tags: ["iOS", "SwiftUI", "UX"],
            activelyLookingFor: "A co-founder for a fintech startup."
        ),
        DiscoverUser(
            id: UUID(),
            name: "Dev Patel",
            bio: "Backend + APIs. Reliability, observability, and fast iteration.",
            tags: ["APIs", "Postgres", "DevOps"]
        ),
        DiscoverUser(
            id: UUID(),
            name: "Riley Santos",
            bio: "Product generalist: discovery, prototypes, and getting v1 out the door.",
            tags: ["Product", "Design", "Strategy"]
        ),
        DiscoverUser(
            id: UUID(),
            name: "Casey Nguyen",
            bio: "Hackathon regular. Crisp UI, mock data, shipping on time.",
            tags: ["Demo", "Frontend", "Pitch"]
        ),
        DiscoverUser(
            id: UUID(),
            name: "Jonathan Flores",
            bio: "Hackathon regular. Crisp UI, mock data, shipping on time.",
            tags: ["Demo", "Frontend", "Pitch"]
        ),
        DiscoverUser(
            id: UUID(),
            name: "Gawin Nogueira",
            bio: "Hackathon regular. Crisp UI, mock data, shipping on time.",
            tags: ["Demo", "Frontend", "Pitch"]
        ),
        DiscoverUser(
            id: UUID(),
            name: "Casey Smith",
            bio: "Hackathon regular. Crisp UI, mock data, shipping on time.",
            tags: ["Demo", "Frontend", "Pitch"]
        ),
    ]
}
