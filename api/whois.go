package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/likexian/whois"
	whoisparser "github.com/likexian/whois-parser"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	domain := strings.TrimSpace(r.URL.Query().Get("domain"))
	if domain == "" {
		http.Error(w, "missing domain query param", http.StatusBadRequest)
		return
	}

	whois_raw, err := whois.Whois(domain)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	result, err := whoisparser.Parse(whois_raw)
	if err != nil {
		if errors.Is(err, whoisparser.ErrNotFoundDomain) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		if errors.Is(err, whoisparser.ErrPremiumDomain) {
			http.Error(w, err.Error(), http.StatusPaymentRequired)
			return
		}

		if errors.Is(err, whoisparser.ErrDomainLimitExceed) {
			http.Error(w, err.Error(), http.StatusTooManyRequests)
			return
		}

		if errors.Is(err, whoisparser.ErrReservedDomain) {
			http.Error(w, err.Error(), http.StatusForbidden)
			return
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(result)
	if err != nil {
		w.Header().Set("Content-Type", "text/plain")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
