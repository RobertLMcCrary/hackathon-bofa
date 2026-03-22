import SwiftUI

/// Discover home: mock users only, no Supabase.
struct DiscoverView: View {
    private let users = DiscoverMockUsers.all

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(users) { user in
                        DiscoverUserCard(user: user)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Discover")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

#Preview {
    DiscoverView()
}
