import SwiftUI
import CoreLocation

@main
struct BumplyApp: App {
    @StateObject private var locationManager = LocationManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView(locationManager: locationManager)
        }
    }
}
