import SwiftUI
import CoreLocation

@main
struct frontendApp: App {
    @StateObject private var locationManager = LocationManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView(locationManager: locationManager)
        }
    }
}
