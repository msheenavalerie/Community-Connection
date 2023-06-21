import UIKit

// MARK: - Community View Controller

class CommunityViewController: UIViewController {

    // MARK: - Outlets
    @IBOutlet weak var tableView: UITableView!
    
    // MARK: - Variables
    var users = [User]()
    
    // MARK: - Life Cycle
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupTableView()
        fetchUsers()
    }
    
    // MARK: - Setup
    func setupTableView() {
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "UserCell")
    }
    
    // MARK: - Networking
    func fetchUsers() {
        let url = "https://jsonplaceholder.typicode.com/users"
        guard let userURL = URL(string: url) else { return }
        
        let session = URLSession.shared.dataTask(with: userURL) { (data, response, error) in
            if let data = data {
                do {
                    let json = try JSONSerialization.jsonObject(with: data, options: [])
                    guard let userData = json as? [[String: Any]] else { return }
                    
                    for user in userData {
                        let user = User(userData: user)
                        self.users.append(user)
                    }
                    
                    DispatchQueue.main.async {
                        self.tableView.reloadData()
                    }
                    
                } catch {
                    print(error)
                }
            }
        }
        session.resume()
    }
}

// MARK: - UITableView DataSource & Delegate
extension CommunityViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return users.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "UserCell", for: indexPath)
        cell.textLabel?.text = users[indexPath.row].username
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print("Selected Row: \(indexPath.row)")
    }
}

// MARK: - User Model
struct User {
    let id: Int
    let name: String
    let username: String
    
    init(userData: [String: Any]) {
        self.id = userData["id"] as? Int ?? 0
        self.name = userData["name"] as? String ?? ""
        self.username = userData["username"] as? String ?? ""
    }
}