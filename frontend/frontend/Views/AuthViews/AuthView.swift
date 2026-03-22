import SwiftUI
import Supabase

struct AuthView: View {
    @State var email = ""
    @State var password = ""
    @State var isLoading = false
    @State var isSignUp = false
    @State var result: Result<Void, Error>?
    @State var showSignUpSuccess = false
    
    var body: some View {
        if showSignUpSuccess {
            VStack(spacing: 16) {
                Text("✉️").font(.system(size: 48))
                Text("Check your email")
                    .font(.title2).bold()
                Text("We sent a confirmation link to \(email). You can sign in now.")
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                    .padding(.horizontal)
                
                Button("Go to sign in") {
                    showSignUpSuccess = false
                    isSignUp = false
                    password = ""
                    result = nil
                }
                .padding(.top, 8)
            }
            .padding()
        } else {
            Form {
                Section {
                    TextField("Email", text: $email)
                        .textContentType(.emailAddress)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                    
                    SecureField("Password", text: $password)
                        .textContentType(isSignUp ? .newPassword : .password)
                }
                
                Section {
                    Button(isSignUp ? "Sign up" : "Sign in") {
                        isSignUp ? signUpButtonTapped() : signInButtonTapped()
                    }
                    
                    Button(isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up") {
                        isSignUp.toggle()
                        result = nil
                    }
                    .foregroundStyle(.secondary)
                    
                    if isLoading {
                        ProgressView()
                    }
                }
                
                if let result {
                    Section {
                        switch result {
                        case .success:
                            Text("Signed in successfully.")
                        case .failure(let error):
                            Text(error.localizedDescription).foregroundStyle(.red)
                        }
                    }
                }
            }
            .navigationTitle(isSignUp ? "Create account" : "Sign in")
            .animation(.default, value: isSignUp)
        }
    }
    
    func signInButtonTapped() {
        Task {
            isLoading = true
            defer { isLoading = false }
            do {
                try await supabase.auth.signIn(email: email, password: password)
                result = .success(())
            } catch {
                result = .failure(error)
            }
        }
    }
    
    func signUpButtonTapped() {
        Task {
            isLoading = true
            defer { isLoading = false }
            do {
                try await supabase.auth.signUp(email: email, password: password)
                showSignUpSuccess = true
            } catch {
                result = .failure(error)
            }
        }
    }
}
