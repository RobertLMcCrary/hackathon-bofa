import SwiftUI
import Supabase
import CoreLocation

struct ContentView: View {
    @ObservedObject var locationManager: LocationManager
    @State var isAuthenticated = false
    
    var body: some View {
        Group {
            if isAuthenticated {
                TabsView(locationManager: locationManager)
            } else {
                AuthView()
            }
        }
        .task {
            for await state in supabase.auth.authStateChanges {
                if [.initialSession, .signedIn, .signedOut].contains(state.event) {
                    isAuthenticated = state.session != nil
                }
            }
        }
    }
}
