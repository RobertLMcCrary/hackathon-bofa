import CoreLocation
import Foundation
import Combine

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    @Published var userLocation: CLLocation?
    @Published var authorizationStatus: CLAuthorizationStatus?
    
    override init() {
        super.init()
        manager.delegate = self
        // Configure accuracy, distance filters, etc., here if needed.
        // manager.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    func requestLocationWhenInUsePermission() {
        manager.requestWhenInUseAuthorization()
    }
    
    func requestLocationAlwaysUsagePermission() {
        manager.requestAlwaysAuthorization()
    }
    
    // Delegate method called when the authorization status changes
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        authorizationStatus = manager.authorizationStatus
        switch manager.authorizationStatus {
        case .authorizedWhenInUse, .authorizedAlways:
            manager.startUpdatingLocation() // Start getting location updates once authorized.
        case .denied, .restricted:
            print("Location access denied or restricted.")
        case .notDetermined:
            print("Location status not determined.")
        @unknown default:
            break
        }
    }
    
    // Delegate method called when new location data is available
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        userLocation = locations.first
    }
    
    // Delegate method called if an error occurs
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location manager failed with error: \(error.localizedDescription)")
    }
}
