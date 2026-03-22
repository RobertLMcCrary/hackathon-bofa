import SwiftUI
import Supabase
import CoreLocation

struct TabsView: View {
    @ObservedObject var locationManager: LocationManager
    
    var body: some View {
        TabView {
            HomeView(locationManager: locationManager)
                .tabItem {
                    Label("Home", systemImage: "house")
                }
            DiscoverView()
                .tabItem {
                    Label("Discover", systemImage: "person")
                }
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.crop.circle")
                }
            SettingsView(locationManager: locationManager)
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
    }
}
