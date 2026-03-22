import Supabase
import Foundation

let supabaseURL = URL(string: "https://oljwaheqfgrymndyexju.supabase.co")!
let supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sandhaGVxZmdyeW1uZHlleGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODIyMjcsImV4cCI6MjA4OTI1ODIyN30.73MtWozYRM7cIqqMkIuvEE_QTOH0Wc2udZm67TM-Am0"

let supabase = SupabaseClient(
    supabaseURL: supabaseURL,
    supabaseKey: supabaseAnonKey
)
