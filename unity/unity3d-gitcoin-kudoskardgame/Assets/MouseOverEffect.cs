using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MouseOverEffect : MonoBehaviour
{
    public GameObject GameManager;
    private BlueprintKudosProvider _bps;
    // Start is called before the first frame update
    void Start()
    {
        if (GameManager != null)
        {
            _bps = GameManager.GetComponent<BlueprintKudosProvider>();
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    private void OnMouseOver()
    {
        if (_bps != null)
        {
            _bps.SetCurrentSelectObject(this.gameObject);
        }
    }
}
