using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BlueprintKudosProvider : MonoBehaviour
{
    public GameObject CurrentlySelected;
    public GameObject BlueprintObj;
    public GameObject KudosPrefab;

    public List<Texture> TextureList;
    private List<GameObject> _bpobj;

    // Start is called before the first frame update
    void Start()
    {
        if (BlueprintObj != null)
        {
            // create 6 possible versions
            BlueprintObj.GetComponent<Renderer>().enabled = false;
            _bpobj = new List<GameObject>();
            _bpobj.Add(GameObject.Instantiate(BlueprintObj, this.transform));
            _bpobj.Add(GameObject.Instantiate(BlueprintObj, this.transform));
            _bpobj.Add(GameObject.Instantiate(BlueprintObj, this.transform));
            _bpobj.Add(GameObject.Instantiate(BlueprintObj, this.transform));
            _bpobj.Add(GameObject.Instantiate(BlueprintObj, this.transform));
            _bpobj.Add(GameObject.Instantiate(BlueprintObj, this.transform));
            
        }

    }

    // Update is called once per frame
    void Update()
    {
        
    }
    public void SetCurrentSelectObject(GameObject obj)
    {
        if (obj == this.CurrentlySelected)
            return;

        this.CurrentlySelected = obj;
        var gobjs = BlueprintObj.GetComponent<Renderer>().bounds.size;
        print("gobjs size: " + gobjs);
        for (int i = 0; i < 6; i++) { 
            _bpobj[i].transform.SetPositionAndRotation(this.CurrentlySelected.transform.position, this.CurrentlySelected.transform.rotation);
            _bpobj[i].GetComponent<Renderer>().enabled = true;
        }
        _bpobj[0].transform.Translate(gobjs.x, 0, 0);
        _bpobj[1].transform.Translate(-gobjs.x, 0, 0);
        _bpobj[2].transform.Translate(gobjs.x / 2f, gobjs.z * 3 / 4, 0);
        _bpobj[3].transform.Translate(-gobjs.x / 2f, gobjs.z * 3 / 4, 0);
        _bpobj[4].transform.Translate(gobjs.x/2f, -gobjs.z * 3 / 4,0);
        _bpobj[5].transform.Translate(-gobjs.x/2f, -gobjs.z * 3 / 4,0);
        
    }

    public void placeKudos(GameObject bpLoc)
    {
        var kudosLoc = bpLoc.transform;
        for (int i = 0; i < 6; i++)
        {
            _bpobj[i].GetComponent<Renderer>().enabled = false;
        }
        GameObject p = GameObject.Instantiate(KudosPrefab, this.transform);
        p.transform.SetPositionAndRotation(bpLoc.transform.position, bpLoc.transform.rotation);
        p.GetComponent<MeshRenderer>().material.SetTexture("_MainTex", TextureList[Random.Range(0, TextureList.Count)]);
        int atk = Random.Range(0, 10);
        int def = Random.Range(0, 10);
        foreach (TextMesh tm in p.GetComponentsInChildren<TextMesh>())
        {
            tm.text = string.Format("{0} / {1}",atk, def);
        }
        
    }
}
