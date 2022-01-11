/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const richNativeTag = {
  'div': {
    events: ['reachstart', 'reachend', 'reachtop', 'reachbottom'],
    attrs: {},
  },
  'a': {
    textContent: true,
    children: ['span'],
    attrs: {
      visited: {
        enum: ['false', 'true'],
      },
      href: {},
      value: {},
    },
  },
  'button': {
    textContent: true,
    atomic: true,
    selfClosing: true,
    attrs: {
      type: {
        enum: ['capsule', 'circle', 'text', 'arc', 'download'],
      },
      value: {},
      icon: {},
      waiting: {
        enum: ['false', 'true'],
      },
      placement: {
        def: 'end',
        enum: ['end', 'start', 'top', 'bottom'],
      },
    },
  },
  'text': {
    textContent: true,
    children: ['a', 'span', 'tspan', 'textpath', 'animate', 'animatetransform'],
    attrs: {
      value: {},
      fill: {},
      fillOpacity: {},
      stroke: {},
      strokeOpacity: {},
      strokeWidth: {},
      transform: {},
      opacity: {},
      x: {},
      y: {},
      id: {},
      dx: {},
      dy: {},
      rotate: {},
      fontSize: {},
    },
  },
  'span': {
    textContent: true,
    children: ['span'],
    excludeRoot: true,
    parents: ['text', 'span'],
    uevents: ['click'],
    uattrs: {
      id: {},
      style: {},
      class: {},
      ref: {},
      data: {},
      springeffect: {
        enum: ['spring-small', 'spring-medium', 'spring-large'],
      },
      dir: {
        enum: ['auto', 'rtl', 'ltr'],
      },
      if: {
        excludeRoot: true,
        def: 'false',
      },
      elif: {
        def: 'false',
      },
      else: {
        excludeRoot: true,
        def: 'false',
      },
      for: {
        excludeRoot: true,
      },
      tid: {},
      show: {
        excludeRoot: true,
        def: 'true',
      },
      shareid: {},
      voicelabel: {},
      subscriptlabel: {},
      scenelabel: {
        enum: ['video', 'audio', 'page', 'switch', 'common'],
      },
      subscriptflag: {
        enum: ['auto', 'on', 'off'],
      },
      accessibilitygroup: {
        enum: ['false', 'true'],
      },
      accessibilitytext: {},
      accessibilitydescription: {},
      accessibilityimportance: {
        enum: ['auto', 'yes', 'no', 'no-hide-descendants'],
      },
    },
  },
  'richtext': {
    textContent: true,
    uevents: ['start', 'complete'],
  },
  'image': {
    alias: ['img'],
    events: ['error', 'complete'],
    atomic: true,
    selfClosing: true,
    attrs: {
      src: {
        checkPath: true,
      },
      alt: {
        checkPath: true,
      },
    },
  },
  'image-animator': {
    atomic: true,
    selfClosing: true,
    events: ['start', 'pause', 'stop', 'resume'],
    attrs: {
      images: {
        required: true,
      },
      predecode: {
        def: 0,
        checkFunc: 'number',
      },
      iteration: {},
      reverse: {
        enum: ['false', 'true'],
      },
      fixedsize: {
        enum: ['true', 'false'],
      },
      duration: {
        required: true,
      },
      fillmode: {
        enum: ['forwards', 'none'],
      },
    },
  },
  'divider': {
    atomic: true,
    selfClosing: true,
    uattrs: {
      vertical: {
        enum: ['false', 'true'],
      },
      id: {},
      style: {},
      class: {},
      ref: {},
      data: {},
      springeffect: {
        enum: ['spring-small', 'spring-medium', 'spring-large'],
      },
      dir: {
        enum: ['auto', 'rtl', 'ltr'],
      },
      if: {
        excludeRoot: true,
        def: 'false',
      },
      elif: {
        def: 'false',
      },
      else: {
        excludeRoot: true,
        def: 'false',
      },
      for: {
        excludeRoot: true,
      },
      tid: {},
      show: {
        excludeRoot: true,
        def: 'true',
      },
      shareid: {},
      data: {},
      voicelabel: {},
      subscriptlabel: {},
      scenelabel: {
        enum: ['video', 'audio', 'page', 'switch', 'common'],
      },
      subscriptflag: {
        enum: ['auto', 'on', 'off'],
      },
      accessibilitygroup: {
        enum: ['false', 'true'],
      },
      accessibilitytext: {},
      accessibilitydescription: {},
      accessibilityimportance: {
        enum: ['auto', 'yes', 'no', 'no-hide-descendants'],
      },
    },
    uevents: [],
  },
  'menu': {
    uevents: ['selected', 'cancel'],
    children: ['option'],
    uattrs: {
      target: {},
      title: {},
      type: {
        enum: ['click', 'longpress'],
      },
      id: {},
      class: {},
      style: {},
      data: {},
      springeffect: {
        enum: ['spring-small', 'spring-medium', 'spring-large'],
      },
      dir: {
        enum: ['auto', 'rtl', 'ltr'],
      },
      if: {
        excludeRoot: true,
        def: 'false',
      },
      elif: {
        def: 'false',
      },
      else: {
        excludeRoot: true,
        def: 'false',
      },
      for: {
        excludeRoot: true,
      },
      show: {
        excludeRoot: true,
        def: 'true',
      },
      tid: {},
      shareid: {},
      voicelabel: {},
      subscriptlabel: {},
      scenelabel: {
        enum: ['video', 'audio', 'page', 'switch', 'common'],
      },
      subscriptflag: {
        enum: ['auto', 'on', 'off'],
      },
      accessibilitygroup: {
        enum: ['false', 'true'],
      },
      accessibilitytext: {},
      accessibilitydescription: {},
      accessibilityimportance: {
        enum: ['auto', 'yes', 'no', 'no-hide-descendants'],
      },
    },
  },
  'navigation-bar': {
    events: ['backclick', 'startclick', 'endclick'],
    uevents: [],
    children: ['navigation-menu', 'select', 'tab-bar'],
    attrs: {
      type: {
        enum: ['normal', 'emphasize'],
      },
      title: {
        required: true,
      },
      subtitle: {},
      header: {},
      backenabled: {
        enum: ['false', 'true'],
      },
      starticon: {},
      endicon: {},
      logo: {},
    },
  },
  'navigation-menu': {
    events: ['selected'],
    uevents: [],
    children: ['option'],
    attrs: {},
  },
  'calendar': {
    atomic: true,
    selfClosing: true,
    events: ['selectedchange'],
    uevents: [],
    attrs: {
      date: {
        checkFunc: 'date',
      },
      dateadapter: {},
      startdayofweek: {},
      workdays: {},
      holidays: {},
    },
  },
  'chart': {
    atomic: true,
    selfClosing: true,
    attrs: {
      type: {
        enum: ['line', 'bar', 'gauge', 'progress', 'loading', 'rainbow'],
      },
      percent: {
        def: 0,
        checkFunc: 'number',
      },
      options: {},
      datasets: {},
      segments: {},
      effects: {
        enum: ['true', 'false'],
      },
      animationduration: {
        def: 3000,
        checkFunc: 'number',
      },
    },
  },
  'dialog': {
    uevents: ['cancel'],
    uattrs: {
      id: {},
      style: {},
      class: {},
      ref: {},
      disabled: {
        enum: ['false', 'true'],
      },
      data: {},
      dir: {
        enum: ['auto', 'rtl', 'ltr'],
      },
      if: {
        excludeRoot: true,
        def: 'false',
      },
      elif: {
        def: 'false',
      },
      else: {
        excludeRoot: true,
        def: 'false',
      },
      for: {
        excludeRoot: true,
      },
      tid: {},
      show: {
        excludeRoot: true,
        def: 'true',
      },
      shareid: {},
      voicelabel: {},
      subscriptlabel: {},
      scenelabel: {
        enum: ['video', 'audio', 'page', 'switch', 'common'],
      },
      subscriptflag: {
        enum: ['auto', 'on', 'off'],
      },
      accessibilitygroup: {
        enum: ['false', 'true'],
      },
      accessibilitytext: {},
      accessibilitydescription: {},
      accessibilityimportance: {
        enum: ['auto', 'yes', 'no', 'no-hide-descendants'],
      },
    },
  },
  'slider': {
    atomic: true,
    selfClosing: true,
    events: ['change'],
    attrs: {
      min: {
        def: 0,
        checkFunc: 'number',
      },
      max: {
        def: 100,
        checkFunc: 'number',
      },
      step: {
        def: 1,
        checkFunc: 'number',
      },
      value: {
        def: 0,
        checkFunc: 'number',
      },
      type: {
        def: 'continuous',
        enum: ['continuous', 'intermittent'],
      },
      mode: {
        def: 'outset',
        enum: ['outset', 'inset'],
      },
      minicon: {},
      maxicon: {},
      showsteps: {
        enum: ['false', 'true'],
      },
      showtips: {
        enum: ['false', 'true'],
      },
    },
  },
  'svg': {
    children: ['svg', 'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'animate', 'animatetransform', 'animatemotion'],
    attrs: {
      fill: {},
      fillOpacity: {},
      fillRule: {
        enum: ['nonzero', 'evenodd'],
      },
      opacity: {},
      stroke: {},
      strokeDasharray: {},
      strokeDashoffset: {},
      strokeLinejoin: {
        enum: ['bevel', 'miter', 'round'],
      },
      strokeLinecap: {
        enum: ['butt', 'round', 'square'],
      },
      strokeMiterlimit: {},
      strokeOpacity: {},
      strokeWidth: {},
      transform: {},
      fontSize: {},
      width: {},
      height: {},
      x: {},
      y: {},
      viewbox: {},
    },
  },
  'tspan': {
    uattrs: {
      fill: {},
      fillOpacity: {},
      stroke: {},
      strokeOpacity: {},
      strokeWidth: {},
      x: {},
      y: {},
      id: {},
      dx: {},
      dy: {},
      rotate: {},
      transform: {},
      fontSize: {},
    },
  },
  'textpath': {
    children: ['tspan', 'textpath', 'animate', 'animatetransform'],
    attrs: {
      fill: {},
      fillOpacity: {},
      stroke: {},
      strokeOpacity: {},
      strokeWidth: {},
      startoffset: {},
      id: {},
      fontSize: {},
      path: {},
      startOffset: {},
    },
  },
  'rect': {
    children: ['animate', 'animatetransform', 'animatemotion'],
    attrs: {
      fill: {},
      fillOpacity: {},
      fillRule: {
        enum: ['nonzero', 'evenodd'],
      },
      opacity: {},
      stroke: {},
      strokeDasharray: {},
      strokeDashoffset: {},
      strokeLinejoin: {
        enum: ['bevel', 'miter', 'round'],
      },
      strokeLinecap: {
        enum: ['butt', 'round', 'square'],
      },
      strokeMiterlimit: {},
      strokeOpacity: {},
      strokeWidth: {},
      transform: {},
      width: {},
      height: {},
      x: {},
      y: {},
      rx: {},
      ry: {},
    },
  },
  'circle': {
    children: ['animate', 'animatetransform', 'animatemotion'],
    uattrs: {
      fill: {},
      fillOpacity: {},
      fillRule: {
        enum: ['nonzero', 'evenodd'],
      },
      opacity: {},
      stroke: {},
      strokeDasharray: {},
      strokeDashoffset: {},
      strokeLinejoin: {
        enum: ['bevel', 'miter', 'round'],
      },
      strokeLinecap: {
        enum: ['butt', 'round', 'square'],
      },
      strokeMiterlimit: {},
      strokeOpacity: {},
      strokeWidth: {},
      transform: {},
      cx: {},
      cy: {},
      r: {},
    },
  },
  'ellipse': {
    children: ['animate', 'animatetransform', 'animatemotion'],
    uattrs: {
      fill: {},
      fillOpacity: {},
      fillRule: {
        enum: ['nonzero', 'evenodd'],
      },
      opacity: {},
      stroke: {},
      strokeDasharray: {},
      strokeDashoffset: {},
      strokeLinejoin: {
        enum: ['bevel', 'miter', 'round'],
      },
      strokeLinecap: {
        enum: ['butt', 'round', 'square'],
      },
      strokeMiterlimit: {},
      strokeOpacity: {},
      strokeWidth: {},
      transform: {},
      class: {},
      cx: {},
      cy: {},
      rx: {},
      ry: {},
    },
  },
  'path': {
    children: ['animate', 'animatetransform', 'animatemotion'],
    uattrs: {
      fill: {},
      fillOpacity: {},
      fillRule: {
        enum: ['nonzero', 'evenodd'],
      },
      opacity: {},
      stroke: {},
      strokeDasharray: {},
      strokeDashoffset: {},
      strokeLinejoin: {
        enum: ['bevel', 'miter', 'round'],
      },
      strokeLinecap: {
        enum: ['butt', 'round', 'square'],
      },
      strokeMiterlimit: {},
      id: {},
      strokeOpacity: {},
      strokeWidth: {},
      transform: {},
      d: {},
    },
  },
  'line': {
    children: ['animate', 'animatetransform', 'animatemotion'],
    uattrs: {
      fill: {},
      fillOpacity: {},
      fillRule: {
        enum: ['nonzero', 'evenodd'],
      },
      opacity: {},
      stroke: {},
      strokeDasharray: {},
      strokeDashoffset: {},
      strokeLinejoin: {
        enum: ['bevel', 'miter', 'round'],
      },
      strokeLinecap: {
        enum: ['butt', 'round', 'square'],
      },
      strokeMiterlimit: {},
      strokeOpacity: {},
      strokeWidth: {},
      transform: {},
      class: {},
      x1: {},
      y1: {},
      x2: {},
      y2: {},
    },
  },
  'polyline': {
    children: ['animate', 'animatetransform', 'animatemotion'],
    uattrs: {
      fill: {},
      fillOpacity: {},
      fillRule: {
        enum: ['nonzero', 'evenodd'],
      },
      opacity: {},
      stroke: {},
      strokeDasharray: {},
      strokeDashoffset: {},
      strokeLinejoin: {
        enum: ['bevel', 'miter', 'round'],
      },
      strokeLinecap: {
        enum: ['butt', 'round', 'square'],
      },
      strokeMiterlimit: {},
      strokeOpacity: {},
      strokeWidth: {},
      transform: {},
      points: {},
    },
  },
  'polygon': {
    children: ['animate', 'animatetransform', 'animatemotion'],
    uattrs: {
      fill: {},
      fillOpacity: {
        def: 1,
      },
      fillRule: {
        enum: ['nonzero', 'evenodd'],
      },
      opacity: {
        def: 1,
      },
      stroke: {},
      strokeDasharray: {},
      strokeDashoffset: {},
      strokeLinejoin: {
        enum: ['bevel', 'miter', 'round'],
      },
      strokeLinecap: {
        enum: ['butt', 'round', 'square'],
      },
      strokeMiterlimit: {
        def: 4,
      },
      strokeOpacity: {
        def: 1,
      },
      strokeWidth: {},
      class: {},
      transform: {},
      points: {},
    },
  },
  'animate': {
    atomic: true,
    uattrs: {
      id: {},
      begin: {
        def: 0,
        checkFunc: 'time',
      },
      dur: {
        def: 0,
        checkFunc: 'time',
      },
      end: {
        def: 0,
        checkFunc: 'time',
      },
      fill: {
        enum: ['freeze', 'remove'],
      },
      keytimes: {},
      keysplines: {},
      repeatcount: {},
      calcmode: {},
      attributename: {},
      from: {},
      to: {},
      values: {},
    },
  },
  'animatemotion': {
    atomic: true,
    uattrs: {
      begin: {
        def: 0,
        checkFunc: 'time',
      },
      dur: {
        def: 0,
        checkFunc: 'time',
      },
      end: {
        def: 0,
        checkFunc: 'time',
      },
      repeatcount: {},
      fill: {
        enum: ['freeze', 'remove'],
      },
      calcmode: {
        enum: ['discrete', 'linear', 'paced', 'spline'],
      },
      keytimes: {},
      keysplines: {},
      from: {},
      to: {},
      keypoints: {},
      path: {},
      rotate: {},
    },
  },
  'animatetransform': {
    atomic: true,
    uattrs: {
      begin: {
        def: 0,
        checkFunc: 'time',
      },
      dur: {
        def: 0,
        checkFunc: 'time',
      },
      end: {
        def: 0,
        checkFunc: 'time',
      },
      repeatcount: {
        def: 1,
        checkFunc: ['number','indefinite'],
      },
      fill: {
        enum: ['freeze', 'remove'],
      },
      calcmode: {},
      from: {},
      to: {},
      values: {},
      attributetype: {},
      attributename: {},
      type: {},
    },
  },
  'list': {
    events: ['scroll', 'scrollbottom', 'scrolltop', 'scrollend', 'scrolltouchup', 'requestitem', 'indexerchange', 'rotate'],
    children: ['list-item', 'list-item-group'],
    attrs: {
      scrollpage: {
        enum: ['false', 'true'],
      },
      cachedcount: {
        def: 0,
        checkFunc: 'number',
      },
      scrollbar: {
        enum: ['off', 'auto', 'on'],
      },
      scrolleffect: {
        enum: ['spring', 'fade', 'no'],
      },
      indexer: {
        enum: ['false', 'true'],
      },
      shapemode: {
        enum: ['default', 'rect', 'round'],
      },
      itemscale: {
        enum: ['true', 'false'],
      },
      itemcenter: {
        enum: ['false', 'true'],
      },
      updateeffect: {
        enum: ['false', 'true'],
      },
      scrollvibrate: {
        enum: ['true', 'false'],
      },
      initialindex: {
        def: 0,
        checkFunc: 'number',
      },
      initialoffset: {
        def: 0,
        checkFunc: 'length',
      },
      indexercircle: {
        enum: ['false', 'true'],
      },
      indexermulti: {
        enum: ['false', 'true'],
      },
      indexerbubble: {
        enum: ['true', 'false'],
      },
      divider: {
        enum: ['false', 'true'],
      },
      chainanimation: {
        enum: ['false', 'true'],
      },
      selected: {},
    },
  },
  'list-item': {
    excludeRoot: true,
    parents: ['list', 'list-item-group'],
    events: ['sticky'],
    attrs: {
      type: {},
      card: {
        enum: ['true', 'false'],
      },
      primary: {
        enum: ['false', 'true'],
      },
      section: {},
      sticky: {
        enum: ['none', 'normal', 'opacity'],
      },
      stickyradius: {
        checkFunc: 'length',
      },
      clickeffect: {
        enum: ['true', 'false'],
      },
    },
  },
  'list-item-group': {
    excludeRoot: true,
    parents: ['list'],
    children: ['list-item'],
    events: ['groupclick', 'groupcollapse', 'groupexpand'],
    attrs: {
      type: {},
    },
  },
  'block': {
    excludeRoot: true,
    uattrs: {
      for: {},
      tid: {},
      if: {
        def: 'false',
      },
      elif: {
        def: 'false',
      },
      else: {
        def: 'false',
      },
    },
  },
  'slot': {
    atomic: true,
    selfClosing: true,
    excludeRoot: true,
    uattrs: {
      content: {},
    },
  },
  'input': {
    atomic: true,
    selfClosing: true,
    events: ['change', 'enterkeyclick', 'translate', 'share', 'search', 'optionselect', 'selectchange'],
    attrs: {
      checked: {
        enum: ['false', 'true'],
      },
      showcounter: {
        enum: ['false', 'true'],
      },
      type: {
        enum: ['text', 'button', 'checkbox', 'email', 'date', 'time', 'number', 'password', 'radio', 'submit', 'reset'],
      },
      menuoptions: {},
      name: {},
      value: {},
      placeholder: {},
      enterkeytype: {
        enum: ['default', 'next', 'go', 'done', 'send', 'search'],
      },
      maxlength: {
        checkFunc: 'number',
      },
      headericon: {},
      selectedstart: {
        def: -1,
        checkFunc: 'number',
      },
      selectedend: {
        def: -1,
        checkFunc: 'number',
      },
      autofocus: {
        enum: ['false', 'true'],
      },
      softkeyboardenabled: {
        enum: ['true', 'false'],
      },
      showpasswordicon: {
        enum: ['true', 'false'],
      },
    },
  },
  'marquee': {
    atomic: true,
    selfClosing: true,
    events: ['bounce', 'finish', 'start'],
    attrs: {
      scrollamount: {
        def: 6,
        checkFunc: 'number',
      },
      loop: {
        def: -1,
        checkFunc: 'number',
      },
      direction: {
        enum: ['left', 'right'],
      },
    },
  },
  'refresh': {
    uevents: ['refresh', 'pulldown'],
    attrs: {
      refreshing: {
        enum: ['false', 'true'],
      },
      offset: {
        checkFunc: 'length',
      },
      type: {
        enum: ['auto', 'pulldown'],
      },
      lasttime: {
        enum: ['false', 'true'],
      },
      timeoffset: {
        checkFunc: 'length',
      },
      friction: {
        checkFunc: 'number',
      },
    },
  },
  'form': {
    events: ['submit', 'reset'],
  },
  'swiper': {
    unSupportedChildren: ['list'],
    events: ['change', 'rotation'],
    attrs: {
      autoplay: {
        enum: ['false', 'true'],
      },
      indicator: {
        enum: ['true', 'false'],
      },
      indicatormask: {
        enum: ['false', 'true'],
      },
      indicatordisabled: {
        enum: ['false', 'true'],
      },
      index: {
        checkFunc: 'number',
      },
      interval: {
        checkFunc: 'number',
      },
      loop: {
        enum: ['true', 'false'],
      },
      duration: {
        checkFunc: 'number',
      },
      vertical: {
        enum: ['false', 'true'],
      },
      digital: {
        enum: ['false', 'true'],
      },
    },
  },
  'search': {
    events: ['change', 'submit', 'translate', 'share', 'search', 'optionselect', 'selectchange'],
    atomic: true,
    selfClosing: true,
    attrs: {
      icon: {},
      hint: {},
      value: {},
      searchbutton: {},
      menuoptions: {},
      selectedstart: {
        checkFunc: 'number',
      },
      selectedend: {
        checkFunc: 'number',
      },
      autofocus: {
        enum: ['false', 'true'],
      },
      softkeyboardenabled: {
        enum: ['false', 'true'],
      },
    },
  },
  'progress': {
    atomic: true,
    selfClosing: true,
    events: [],
    attrs: {
      type: {
        enum: ['horizontal', 'circular', 'ring', 'scale-ring', 'arc', 'eclipse'],
      },
      percent: {
        def: 0,
        checkFunc: 'number',
      },
      secondarypercent: {
        def: 0,
        checkFunc: 'number',
      },
      clockwise: {
        enum: ['true', 'false'],
      },
    },
  },
  'picker': {
    events: ['change', 'columnchange', 'cancel'],
    atomic: true,
    selfClosing: true,
    uevents: ['focus', 'blur', 'longpress', 'key', 'swipe', 'accessibility', 'touchstart',
      'touchmove', 'touchcancel', 'touchend'],
    attrs: {
      type: {
        enum: ['text', 'date', 'time', 'datetime', 'multi-text'],
      },
      start: {
        checkFunc: 'date',
      },
      end: {
        checkFunc: 'date',
      },
      range: {},
      selected: {},
      value: {},
      containsecond: {
        enum: ['false', 'true'],
      },
      columns: {
        checkFunc: 'number',
      },
      lunarswitch: {
        enum: ['false', 'true'],
      },
      hours: {
        enum: ['24', '12'],
      },
      lunar: {
        enum: ['false', 'true'],
      },
    },
  },
  'picker-view': {
    atomic: true,
    selfClosing: true,
    uevents: ['change', 'columnchange'],
    attrs: {
      type: {
        enum: ['text', 'time', 'date', 'datetime', 'multi-text'],
      },
      range: {},
      selected: {},
      indicatorprefix: {},
      indicatorsuffix: {},
      containsecond: {
        enum: ['false', 'true'],
      },
      start: {
        checkFunc: 'date',
      },
      end: {
        checkFunc: 'date',
      },
      lunarswitch: {
        enum: ['false', 'true'],
      },
      columns: {
        checkFunc: 'number',
      },
      hours: {
        enum: ['24', '12'],
      },
      lunar: {
        enum: ['false', 'true'],
      },
    },
  },
  'qrcode': {
    atomic: true,
    events: [],
    selfClosing: true,
    attrs: {
      value: {
        required: true,
      },
      type: {
        enum: ['rect', 'circle'],
      },
    },
  },
  'switch': {
    atomic: true,
    events: ['change'],
    selfClosing: true,
    attrs: {
      checked: {
        enum: ['false', 'true'],
      },
      showtext: {
        enum: ['false', 'true'],
      },
      texton: {},
      textoff: {},
    },
  },
  'label': {
    textContent: true,
    atomic: true,
    selfClosing: true,
    attrs: {
      target: {},
    },
    uevents: [],
  },
  'textarea': {
    atomic: true,
    selfClosing: true,
    textContent: true,
    events: ['change', 'translate', 'share', 'search', 'optionselect', 'selectchange'],
    attrs: {
      placeholder: {},
      menuoptions: {},
      value: {},
      maxlength: {
        checkFunc: 'number',
      },
      headericon: {},
      extend: {
        enum: ['false', 'true'],
      },
      showcounter: {
        enum: ['false', 'true'],
      },
      selectedstart: {
        def: -1,
        checkFunc: 'number',
      },
      selectedend: {
        def: -1,
        checkFunc: 'number',
      },
      autofocus: {
        enum: ['false', 'true'],
      },
      softkeyboardenabled: {
        enum: ['true', 'false'],
      },
    },
  },
  'video': {
    atomic: true,
    selfClosing: true,
    events: ['start', 'pause', 'finish', 'stop', 'error', 'prepared', 'fullscreenchange', 'timeupdate', 'seeked', 'seeking'],
    attrs: {
      autoplay: {
        enum: ['false', 'true'],
      },
      poster: {
        checkPath: true,
      },
      src: {
        checkPath: true,
      },
      muted: {
        enum: ['false', 'true'],
      },
      controls: {
        enum: ['true', 'false'],
      },
      loop: {
        enum: ['false', 'true'],
      },
      starttime: {
        def: 0,
        checkFunc: 'number',
      },
      direction: {
        enum: ['auto', 'vertical', 'horizontal', 'adapt'],
      },
      speed: {
        def: 1.0,
        checkFunc: 'number',
      }
    },
  },
  'audio': {
    atomic: true,
    selfClosing: true,
    attrs: {
      streamType: {
        enum: ['music', 'voicecall'],
      },
    },
  },
  'camera': {
    atomic: true,
    selfClosing: true,
    events: ['error'],
    attrs: {
      deviceposition: {
        enum: ['back', 'front'],
      },
      flash: {
        enum: ['auto', 'on', 'off', 'torch'],
      },
    },
  },
  'canvas': {
    atomic: true,
    selfClosing: true,
    events: [],
    attrs: {},
  },
  'stack': {
    events: [],
    attrs: {},
  },
  'tabs': {
    events: ['change'],
    children: ['tab-content', 'tab-bar'],
    attrs: {
      index: {
        def: 0,
        checkFunc: 'number',
      },
      vertical: {
        enum: ['false', 'true'],
      },
    },
  },
  'tab-content': {
    parents: ['tabs'],
    attrs: {
      scrollable: {
        enum: ['true', 'false'],
      },
    },
  },
  'tab-bar': {
    parents: ['tabs', 'navigation-bar'],
    attrs: {
      mode: {
        enum: ['fixed', 'scrollable'],
      },
    },
  },
  'popup': {
    events: ['visibilitychange'],
    attrs: {
      target: {
        required: true,
      },
      placement: {
        enum: ['bottom', 'left', 'right', 'top', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
      },
      keepalive: {
        enum: ['false', 'true'],
      },
      clickable: {
        enum: ['true', 'false'],
      },
      arrowoffset: {
        checkFunc: 'length',
      },
    },
  },
  'rating': {
    atomic: true,
    selfClosing: true,
    events: ['change'],
    attrs: {
      numstars: {
        checkFunc: 'number',
      },
      rating: {
        checkFunc: 'number',
      },
      stepsize: {
        checkFunc: 'number',
      },
      indicator: {
        enum: ['false', 'true'],
      },
    },
    uevents: ['focus', 'blur', 'key', 'swipe', 'accessibility', 'touchstart', 'touchmove', 'touchcancel', 'touchend'],
  },
  'select': {
    textContent: true,
    events: ['change'],
    children: ['option'],
    uevents: ['focus', 'blur', 'longpress', 'key', 'swipe', 'accessibility', 'touchstart',
      'touchmove', 'touchcancel', 'touchend'],
  },
  'option': {
    atomic: true,
    selfClosing: true,
    excludeRoot: true,
    valueContent: true,
    parents: ['select', 'menu', 'navigation-menu'],
    uevents: [],
    attrs: {
      selected: {
        enum: ['false', 'true'],
      },
      value: {
        required: true,
      },
      icon: {},
      action: {
        enum: ['popup', 'show'],
      },
    },
  },
  'badge': {
    attrs: {
      placement: {
        def: 'rightTop',
        enum: ['right', 'rightTop', 'left'],
      },
      count: {
        def: 0,
        checkFunc: 'number',
      },
      visible: {
        enum: ['false', 'true'],
      },
      maxcount: {
        def: 99,
        checkFunc: 'number',
      },
      config: {},
      label: {},
    },
  },
  'stepper': {
    events: ['finish', 'skip', 'change', 'next', 'back'],
    children: ['stepper-item'],
    attrs: {
      index: {
        checkFunc: 'number',
      },
    },
  },
  'stepper-item': {
    excludeRoot: true,
    parents: ['stepper'],
    events: ['appear', 'disappear'],
    attrs: {
      label: {},
    },
  },
  'panel': {
    uevents: ['sizechange'],
    uattrs: {
      type: {
        enum: ['minibar', 'foldable', 'temporary'],
      },
      mode: {
        enum: ['mini', 'half', 'full'],
      },
      dragbar: {
        enum: ['true', 'false'],
      },
      fullheight: {
        checkFunc: 'length',
      },
      halfheight: {
        checkFunc: 'length',
      },
      miniheight: {
        checkFunc: 'length',
      },
      id: {},
      class: {},
      style: {},
      ref: {},
      data: {},
      tid: {},
      shareid: {},
      voicelabel: {},
      subscriptlabel: {},
      scenelabel: {
        enum: ['video', 'audio', 'page', 'switch', 'common'],
      },
      subscriptflag: {
        enum: ['auto', 'on', 'off'],
      },
      accessibilitygroup: {
        enum: ['false', 'true'],
      },
      accessibilitytext: {},
      accessibilitydescription: {},
      accessibilityimportance: {
        enum: ['auto', 'yes', 'no', 'no-hide-descendants'],
      },
    },
  },
  'toolbar': {
    uevents: [],
    children: ['toolbar-item'],
    attrs: {},
  },
  'toolbar-item': {
    excludeRoot: true,
    parents: ['toolbar'],
    events: [],
    attrs: {
      value: {},
      icon: {},
    },
  },
  'piece': {
    excludeRoot: true,
    events: ['close'],
    attrs: {
      content: {},
      icon: {},
      closable: {
        enum: ['false', 'true'],
      },
    },
  },
  'toggle': {
    excludeRoot: true,
    events: ['change'],
    attrs: {
      value: {},
      checked: {
        enum: ['false', 'true'],
      },
    },
  },
  'grid-container': {
    excludeRoot: true,
    children: ['grid-row'],
    attrs: {
      columns: {},
      sizetype: {},
      gutter: {
        checkFunc: 'length',
      },
      gridtemplate: {
        enum: ['default', 'grid'],
      },
    },
  },
  'grid-row': {
    excludeRoot: true,
    children: ['grid-col'],
    attrs: {},
  },
  'grid-col': {
    excludeRoot: true,
    attrs: {
      xs: {},
      sm: {},
      md: {},
      lg: {},
      span: {
        checkFunc: 'number',
      },
      offset: {
        checkFunc: 'number',
      },
    },
  },
  'xcomponent': {
    atomic: true,
    selfClosing: true,
    uevents: ['load', 'destroy'],
    uattrs: {
      id: {
        required: true,
      },
      type: {
        required: true,
      },
      libraryname: {},
      ref: {},
    },
  },
  'web': {
    atomic: true,
    selfClosing: true,
    uattrs: {
      src: {
        checkPath: true,
      },
      id: {},
    },
    uevents: ['pagestart', 'pagefinish', 'error', 'message'],
  },
};
const richCommonTag = {
  events: ['click', 'dragstart', 'drag', 'dragend', 'dragenter',
    'dragover', 'dragleave', 'drop', 'doubleclick',
    'focus', 'blur', 'doubleclick', 'longpress',
    'pinchstart', 'pinchupdate', 'pinchend', 'pinchcancel',
    'touchstart', 'touchmove', 'touchcancel', 'touchend',
    'swipe', 'key', 'accessibility'],
  attrs: {
    id: {},
    style: {},
    class: {},
    ref: {},
    disabled: {
      enum: ['false', 'true'],
    },
    focusable: {
      enum: ['false', 'true'],
    },
    data: {},
    springeffect: {
      enum: ['spring-small', 'spring-medium', 'spring-large'],
    },
    dir: {
      enum: ['auto', 'rtl', 'ltr'],
    },
    if: {
      excludeRoot: true,
      def: 'false',
    },
    elif: {
      def: 'false',
    },
    else: {
      excludeRoot: true,
      def: 'false',
    },
    for: {
      excludeRoot: true,
    },
    tid: {},
    show: {
      excludeRoot: true,
      def: 'true',
    },
    shareid: {},
    voicelabel: {},
    subscriptlabel: {},
    scenelabel: {
      enum: ['video', 'audio', 'page', 'switch', 'common'],
    },
    subscriptflag: {
      enum: ['auto', 'on', 'off'],
    },
    accessibilitygroup: {
      enum: ['false', 'true'],
    },
    accessibilitytext: {},
    accessibilitydescription: {},
    accessibilityimportance: {
      enum: ['auto', 'yes', 'no', 'no-hide-descendants'],
    },
  },
  children: ['block', 'slot'],
  parents: ['block'],
};
module.exports = {
  richCommonTag: richCommonTag,
  richNativeTag: richNativeTag,
};
