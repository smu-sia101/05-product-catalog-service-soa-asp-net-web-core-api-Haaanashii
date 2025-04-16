using Microsoft.AspNetCore.Mvc;
using SIA_PRODCAT_JOSE.Model;
using Google.Cloud.Firestore.V1;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;


namespace SIA_PRODCAT_JOSE.Controllers
{
    [ApiController]
    [Route("test")]
    public class MessageController : ControllerBase
    {
        private readonly FirestoreDb _firestoreDb;

        public MessageController()
        {
            // Path to your Firebase service account key
            string keyFilePath = Path.Combine(AppContext.BaseDirectory, "firebase-key.json");

            if (!System.IO.File.Exists(keyFilePath))
            {
                throw new FileNotFoundException("firebase-key.json not found.", keyFilePath);
            }

            // Load and scope the credentials
            var credential = GoogleCredential.FromFile(keyFilePath)
                .CreateScoped("https://www.googleapis.com/auth/datastore");

            // Build Firestore client with the scoped credentials
            var builder = new FirestoreClientBuilder
            {
                Credential = credential
            };

            FirestoreClient client = builder.Build();

            // Create Firestore DB instance
            _firestoreDb = FirestoreDb.Create("siaapi", client);
        }

        [HttpPost("test")]
        public async Task<IActionResult> AddSimple([FromBody] Message data)
        {
            var docRef = _firestoreDb.Collection("messages").Document();
            await docRef.SetAsync(data);
            return Ok("Message added");
        }
    }
}
