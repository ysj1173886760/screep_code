var Tower =
{
    run: function(tower)
    {
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile)
        {
            tower.attack(closestHostile);
        }
    }
};

module.exports = Tower;