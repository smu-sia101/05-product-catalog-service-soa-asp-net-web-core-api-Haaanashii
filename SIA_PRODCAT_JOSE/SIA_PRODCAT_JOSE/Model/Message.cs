using Google.Cloud.Firestore;
namespace SIA_PRODCAT_JOSE.Model
{
    [FirestoreData]
    public class Message
    {
        [FirestoreProperty]
        public string text { get; set; }
    }
}
