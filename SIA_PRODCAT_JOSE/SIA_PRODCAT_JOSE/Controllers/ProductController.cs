using Microsoft.AspNetCore.Mvc;
using SIA_PRODCAT_JOSE.Model;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;

namespace SIA_PRODCAT_JOSE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly CollectionReference _productCollection;

        public ProductsController()
        {
            string keyFilePath = Path.Combine(AppContext.BaseDirectory, "firebase-key.json");
            var credential = Google.Apis.Auth.OAuth2.GoogleCredential
                .FromFile(keyFilePath)
                .CreateScoped("https://www.googleapis.com/auth/datastore");

            var builder = new FirestoreClientBuilder { Credential = credential };
            var client = builder.Build();
            _firestoreDb = FirestoreDb.Create("siaapi", client);
            _productCollection = _firestoreDb.Collection("products");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var snapshot = await _productCollection.GetSnapshotAsync();
            var products = snapshot.Documents.Select(d => d.ConvertTo<Product>()).ToList();
            return Ok(products);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            DocumentReference docRef = _firestoreDb.Collection("products").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return NotFound();
            }

            Product product = snapshot.ConvertTo<Product>();
            return Ok(product);
        }

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetById(string id)
        //{
        //    var doc = await _productCollection.Document(id).GetSnapshotAsync();
        //    if (!doc.Exists) return NotFound();
        //    return Ok(doc.ConvertTo<Product>());
        //}

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            if (string.IsNullOrEmpty(product.Id))
            {
                var addedDoc = await _productCollection.AddAsync(product);
                return Ok(new { id = addedDoc.Id });
            }
            else
            {
                var docRef = _productCollection.Document(product.Id);
                await docRef.SetAsync(product);
                return Ok(new { id = product.Id });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Product product)
        {
            await _productCollection.Document(id).SetAsync(product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _productCollection.Document(id).DeleteAsync();
            return NoContent();
        }
    }
}
