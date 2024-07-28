import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ViewChildren, AfterViewInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface SpecialtyTree {
  id: number;
  name: string;
  children?: SpecialtyTree[];
  parents?: ParentRef[];
  checked?: boolean;
}

interface ParentRef {
  id: number;
  type: string;
}

enum ParentType {
  SPECIALITY,
  SUB_SPECIALITY,
}

const TREE_DATA: SpecialtyTree[][] = [
  [
    {
      id: 1,
      name: 'Administració pública',
      children: [
        {
          id: 1,
          name: 'Administració pública',
          checked: true,
          parents: [
            {
              id: 1,
              type: ParentType.SPECIALITY,
            },
          ],
        },
        {
          id: 2,
          name: 'Arquitecto municipal',
          checked: true,
          parents: [
            {
              id: 1,
              type: ParentType.SPECIALITY,
            },
          ],
        },
      ],
    },
  ],
  [
    {
      id: 2,
      name: 'Cultura / Comunicació',
      children: [
        {
          id: 1,
          name: 'Divulgació i publicacions',
          children: [
            {
              id: 3,
              name: "Dibujació de l'arquitectura",
              checked: false,
              parents: [
                {
                  id: 2,
                  type: ParentType.SPECIALITY,
                },
                {
                  id: 1,
                  type: ParentType.SUB_SPECIALITY,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Escenografía',
          children: [
            {
              id: 4,
              name: 'Escenografía',
              checked: true,
              parents: [
                {
                  id: 2,
                  type: ParentType.SPECIALITY,
                },
                {
                  id: 2,
                  type: ParentType.SUB_SPECIALITY,
                },
              ],
            },
            {
              id: 5,
              name: 'Cultura',
              checked: false,
              parents: [
                {
                  id: 2,
                  type: ParentType.SPECIALITY,
                },
                {
                  id: 2,
                  type: ParentType.SUB_SPECIALITY,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
];

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'tree-flat-overview-example',
  templateUrl: 'tree-flat-overview-example.html',
  styleUrls: ['tree-flat-overview-example.css'],
})
export class TreeFlatOverviewExample implements AfterViewInit {
  @ViewChildren('specialtyPickerTree') specialtyPickerTree;

  private transformer = (node: SpecialtyTree, level: number) => {
    return {
      id: node.id,
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      parents: node.parents,
      checked: node.checked,
    };
  };

  dataSources = [];

  originalTreeState: string;
  currentTreeState: string;

  constructor() {
    for (const especialtyBranch of TREE_DATA) {
      const treeControl = new FlatTreeControl<FlatNode>(
        (node) => node.level,
        (node) => node.expandable
      );

      const treeFlattener = new MatTreeFlattener(
        this.transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children
      );

      let dataSource = new MatTreeFlatDataSource(treeControl, treeFlattener);
      dataSource.data = especialtyBranch;
      console.log(dataSource)
      this.dataSources.push(dataSource);
    }
  }

  ngAfterViewInit() {
    console.log(this.dataSources);
    this.specialtyPickerTree.forEach((p) => {
      console.log(p.treeControl);
      p.treeControl.expandAll();
    });
    //this.originalTreeState = JSON.stringify(
    //this.dataSource._expandedData._value
    //);
  }

  onChange(event: Event, node: FlatNode): void {
    const isChecked: boolean = event.target['checked']; // or event.target.checked
    node.checked = isChecked;
    //this.currentTreeState = JSON.stringify(
    // this.dataSource._expandedData._value
    //);
    console.log(this.dataSources);
    //console.log(
    // node,
    //this.currentTreeState === this.originalTreeState,
    //isChecked
    //);
  }
}

/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
