class MembersDictionary {
    constructor() {
      this.members = {};
    }
  
    add(name, idx) {
      let current = this.members;
      let rest = name;
      for (let i in name) {
        rest = rest.slice(1);
        let c = name[i].toLowerCase();
        if (!current[c]) {
          current[c] = { rest: [] };
        }
        current[c].rest.push({ username: name, id: idx });
        current = current[c];
      }
    }
}

export default MembersDictionary
  