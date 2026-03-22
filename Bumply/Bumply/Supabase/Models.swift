import Supabase

struct Profile: Decodable {
    let username: String?
    let fullName: String?
    let website: String?
    let activelyLookingFor: String?
    
    enum CodingKeys: String, CodingKey {
        case username
        case fullName = "full_name"
        case website
        case activelyLookingFor = "actively_looking_for"
    }
}

struct UpdateProfileParams: Encodable {
    let username: String
    let fullName: String
    let website: String
    let activelyLookingFor: String
    
    enum CodingKeys: String, CodingKey {
        case username
        case fullName = "full_name"
        case website
        case activelyLookingFor = "actively_looking_for"
    }
}
