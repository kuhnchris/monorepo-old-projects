using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpawnKudos : MonoBehaviour
{
    public GameObject PreFab;
    public List<Texture> TextureList;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {

        if (Input.GetMouseButtonDown(0))
        {
            GameObject p = GameObject.Instantiate(PreFab, this.transform);
            p.GetComponent<MeshRenderer>().material.SetTexture("_MainTex", TextureList[Random.Range(0, TextureList.Count)]);
            p.transform.Translate(Random.Range(0.0f, 0.3f), Random.Range(0.0f, 0.3f), Random.Range(0.0f, 0.3f));
        }
        if (Input.GetMouseButtonDown(1))
        {
            for (int i = 0; i < 100; i++) { 
            GameObject p = GameObject.Instantiate(PreFab, this.transform);
            p.GetComponent<MeshRenderer>().material.SetTexture("_MainTex", TextureList[Random.Range(0, TextureList.Count)]);
            p.transform.Translate(Random.Range(0.0f, 0.3f), Random.Range(0.0f, 0.3f), Random.Range(0.0f, 0.3f));
            }
        }
    }
}
