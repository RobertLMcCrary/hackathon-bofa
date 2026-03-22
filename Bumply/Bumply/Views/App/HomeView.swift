import SwiftUI
import Supabase

struct HomeView: View {
    @State private var profile: Profile?
    @State private var isLoading = false
    @State private var error: Error?
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                if isLoading {
                    ProgressView("Loading profile...")
                        .padding()
                } else if let profile {
                    profileCard(profile: profile)
                } else if let error {
                    VStack(spacing: 12) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.largeTitle)
                            .foregroundStyle(.orange)
                        Text("Failed to load profile")
                            .font(.headline)
                        Text(error.localizedDescription)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .padding()
                } else {
                    Text("No profile information.")
                        .foregroundStyle(.secondary)
                }
                Spacer()
            }
            .padding()
            .navigationTitle("Home")
        }
        .task {
            await loadProfile()
        }
    }
    
    @ViewBuilder
    private func profileCard(profile: Profile) -> some View {
        VStack(spacing: 16) {
            Image(systemName: "person.crop.circle.fill")
                .resizable()
                .frame(width: 80, height: 80)
                .foregroundStyle(.blue)
                .shadow(radius: 4)
            if let fullName = profile.fullName, !fullName.isEmpty {
                Text(fullName)
                    .font(.title)
                    .bold()
            }
            if let username = profile.username, !username.isEmpty {
                HStack(spacing: 6) {
                    Image(systemName: "at")
                        .foregroundStyle(.secondary)
                    Text(username)
                        .font(.body)
                        .foregroundStyle(.secondary)
                }
            }
            if let website = profile.website, !website.isEmpty {
                HStack(spacing: 6) {
                    Image(systemName: "link")
                        .foregroundStyle(.secondary)
                    Link(website, destination: URL(string: website)!)
                        .font(.body)
                }
            }
        }
        .frame(maxWidth: .infinity)
        .padding(32)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(Color(.systemBackground).opacity(0.7))
                .shadow(radius: 8)
        )
        .padding(.top, 48)
        .padding(.horizontal, 12)
    }
    
    private func loadProfile() async {
        isLoading = true
        error = nil
        do {
            let currentUser = try await supabase.auth.session.user
            let profile: Profile = try await supabase
                .from("profiles")
                .select()
                .eq("id", value: currentUser.id)
                .single()
                .execute()
                .value
            self.profile = profile
        } catch {
            self.error = error
        }
        isLoading = false
    }
}
