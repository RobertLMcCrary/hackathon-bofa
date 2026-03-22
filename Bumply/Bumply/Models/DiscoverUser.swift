import Foundation

/// Mock user for Discover. Separate from Supabase `Profile` until API/auth are wired.
struct DiscoverUser: Identifiable, Hashable {
    let id: UUID
    let name: String
    let bio: String
    let tags: [String]
    var activelyLookingFor: String? = nil
    var metadata: [String: String]? = nil
}
