import SwiftUI
import Supabase
import CoreLocation

struct SettingsView: View {
    @ObservedObject var locationManager: LocationManager
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Location")) {
                    HStack {
                        Text("Location Access")
                        Spacer()
                        Text(statusText)
                            .foregroundStyle(statusColor)
                    }
                    Button("Enable Location") {
                        locationManager.requestLocationWhenInUsePermission()
                    }
                    .disabled(!canRequestPermission)
                }
            }
            .navigationTitle("Settings")
        }
    }
    
    private var statusText: String {
        switch locationManager.authorizationStatus {
        case .authorizedWhenInUse?, .authorizedAlways?:
            return "Enabled"
        case .denied?, .restricted?:
            return "Disabled"
        case .notDetermined?:
            return "Not Determined"
        default:
            return "Unknown"
        }
    }
    private var statusColor: Color {
        switch locationManager.authorizationStatus {
        case .authorizedWhenInUse?, .authorizedAlways?:
            return .green
        case .denied?, .restricted?:
            return .red
        case .notDetermined?:
            return .orange
        default:
            return .gray
        }
    }
    private var canRequestPermission: Bool {
        if let status = locationManager.authorizationStatus {
            return status == .notDetermined
        }
        return true
    }
}
