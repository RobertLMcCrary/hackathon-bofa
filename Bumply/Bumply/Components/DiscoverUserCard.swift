import SwiftUI

/// Reusable card: name, bio, and tag chips for the Discover list.
struct DiscoverUserCard: View {
    let user: DiscoverUser

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(user.name)
                .font(.headline)

            Text(user.bio)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .lineLimit(3)
                .fixedSize(horizontal: false, vertical: true)

            // Fixed height so this horizontal ScrollView doesn't expand vertically inside the
            // outer Discover ScrollView (nested scroll views need a bounded cross-axis size).
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(user.tags, id: \.self) { tag in
                        Text(tag)
                            .font(.caption.weight(.semibold))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color.accentColor.opacity(0.12), in: Capsule())
                    }
                }
            }
            .frame(height: 34, alignment: .center)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color(.secondarySystemGroupedBackground))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .strokeBorder(Color.primary.opacity(0.08), lineWidth: 1)
        )
    }
}

#Preview {
    DiscoverUserCard(user: DiscoverMockUsers.all[0])
        .padding()
        .background(Color(.systemGroupedBackground))
}
