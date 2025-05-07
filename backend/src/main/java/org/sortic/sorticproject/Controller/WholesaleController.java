// WholesaleController.java
package org.sortic.sorticproject.Controller;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.WholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleLink;
import org.sortic.sorticproject.Service.WholesaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wholesale")
public class WholesaleController {

    private final WholesaleService wholesaleService;

    // 도매 코드
    @PostMapping("/code")
    public void createCode(@RequestBody WholesaleCode code) {
        wholesaleService.addWholesaleCode(code);
    }

    @GetMapping("/codes/{userId}")
    public List<WholesaleCode> getCodes(@PathVariable String userId) {
        return wholesaleService.getCodesByUser(userId);
    }

    @DeleteMapping("/code/{id}")
    public void deleteCode(@PathVariable int id) {
        wholesaleService.deleteWholesaleCode(id);
    }

    // 도매 링크
    @PostMapping("/link")
    public void createLink(@RequestBody WholesaleLink link) {
        wholesaleService.addWholesaleLink(link);
    }

    @GetMapping("/links/{userId}")
    public List<WholesaleLink> getLinks(@PathVariable String userId) {
        return wholesaleService.getLinksByUser(userId);
    }

    @PutMapping("/link")
    public void updateLink(@RequestBody WholesaleLink link) {
        wholesaleService.updateWholesaleName(link);
    }

    @DeleteMapping("/link/{id}")
    public void deleteLink(@PathVariable int id) {
        wholesaleService.deleteWholesaleLink(id);
    }
}
